import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass, plainToInstance } from 'class-transformer';
import _ from 'lodash';
import mongoose, { Model, Types } from 'mongoose';

import { Configuration } from '@/config/configuration';
import { PageOptionsDto, SuccessDto, TError } from '@/dto/core';
import { BcryptHelper, codeGeneratorHelper } from '@/helpers';
import { UserRoles, UserStatus } from '@/modules/user/constants';
import { CreateUserDto, RequestUserDto, UpdateUserDto, UserDto } from '@/modules/user/dto';
import { User, UserDocument } from '@/modules/user/schemas/user.schema';
import { FilterUserType, UserType } from '@/modules/user/types';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private _UserModel: Model<User>) {}

    async getUsers(pageOptions: PageOptionsDto): Promise<SuccessDto | TError> {
        const data = await this.aggregateUser(
            {
                $or: [
                    {
                        name: {
                            $regex: `.*${pageOptions.search}.*`,
                        },
                    },
                    {
                        email: {
                            $regex: `.*${pageOptions.search}.*`,
                        },
                    },
                ],
            },
            pageOptions,
        );
        return new SuccessDto(null, HttpStatus.OK, data, UserDto);
    }

    async findUserById(id: string) {
        const data = await this.aggregateUser({ _id: Types.ObjectId.createFromHexString(id) });
        return new SuccessDto(null, HttpStatus.OK, plainToInstance(UserDto, _.first(data.data)));
    }

    async findUserBy(query: FilterUserType): Promise<UserDocument> {
        const user: UserDocument = await this._UserModel.findOne(query).lean();

        if (!user) {
            throw new NotFoundException('user_is_not_exited');
        }

        return user;
    }

    private async create(user: UserType, verificationCode: string = null): Promise<UserDocument> {
        const password = user.password ? await BcryptHelper.hashPassword(user.password) : null;

        return this._UserModel.create({
            email: user.email,
            name: user.name,
            password,
            status: user.role === UserRoles.SUPERUSER ? UserStatus.ACTIVE : UserStatus.IN_ACTIVE,
            role: user.role,
            verificationCode,
        });
    }

    private async checkDuplicateUserByEmail(email: string) {
        const user = await this._UserModel.findOne({
            email,
        });

        if (!!user) {
            throw new ConflictException('user_is_existed');
        }
    }

    async createNewUser(createUserDto: CreateUserDto) {
        await this.checkDuplicateUserByEmail(createUserDto.email);

        const verificationCode = codeGeneratorHelper();

        const newUser = await this.create(
            {
                email: createUserDto.email,
                name: createUserDto.name,
                role: UserRoles[createUserDto.roleMapping],
            },
            verificationCode,
        );

        // todo: implement send verification code

        return new SuccessDto(null, HttpStatus.OK, plainToClass(UserDto, newUser));
    }

    async requestUser(requestUserDto: RequestUserDto) {
        const user = await this._UserModel.findOne({
            email: requestUserDto.email,
        });

        if (!!user) {
            if (user.status === UserStatus.REQUEST) {
                throw new ConflictException('email_has_been_requesting');
            }
            throw new ConflictException('user_is_existed');
        }

        await this._UserModel.create({
            email: requestUserDto.email,
            name: requestUserDto.name,
            status: UserStatus.REQUEST,
            role: UserRoles.USER,
        });

        return new SuccessDto('request_successfully');
    }

    async approveUser(id: mongoose.Types.ObjectId) {
        const verificationCode = codeGeneratorHelper();

        const user = await this._UserModel.findOneAndUpdate(
            {
                _id: id,
                status: UserStatus.REQUEST,
            },
            {
                verificationCode,
                status: UserStatus.IN_ACTIVE,
            },
            { new: true },
        );

        if (!user) {
            throw new NotFoundException('user_request_is_not_existed');
        }

        // todo: implement send verification code

        return new SuccessDto('user_is_approved');
    }

    async resendVerificationEmail(id: mongoose.Types.ObjectId) {
        const verificationCode = codeGeneratorHelper();

        const user = await this._UserModel.findOneAndUpdate(
            {
                _id: id,
                status: UserStatus.IN_ACTIVE,
            },
            {
                verificationCode,
            },
            { new: true },
        );

        if (!user) {
            throw new NotFoundException('resend_email_failed');
        }

        // todo: implement send verification code

        return new SuccessDto('resend_verification_email_success');
    }

    async createSuperUser() {
        const superuser = Configuration.instance.superuser;

        const currentSuperuser = await this._UserModel.findOne({
            role: UserRoles.SUPERUSER,
        });

        if (!currentSuperuser && superuser.email && superuser.pass) {
            await this.create({
                name: 'Super User',
                email: superuser.email,
                password: superuser.pass,
                role: UserRoles.SUPERUSER,
            });
        }
    }

    async delete(id: mongoose.Types.ObjectId) {
        const user = await this._UserModel.findByIdAndDelete(id);

        if (!user) {
            throw new NotFoundException('user is not existed');
        }

        return new SuccessDto('Delete user successfully');
    }

    async updateUser(id: mongoose.Types.ObjectId, updateUserDto: UpdateUserDto) {
        await this.checkUserById(id);

        const userUpdated = await this._UserModel.findByIdAndUpdate(
            id,
            {
                name: updateUserDto.name,
                role: UserRoles[updateUserDto.roleMapping],
            },
            {
                new: true,
            },
        );

        return new SuccessDto(null, HttpStatus.OK, plainToClass(UserDto, userUpdated));
    }

    private async checkUserById(id: mongoose.Types.ObjectId | string) {
        const user = await this._UserModel.findById(id);

        if (!user) {
            throw new NotFoundException('user is not existed');
        }

        return user;
    }

    async activeUser(verificationCode: string, newPassword: string) {
        const user = await this.findUserBy({
            verificationCode,
        });

        if (user.status === UserStatus.ACTIVE) {
            throw new BadRequestException('user_is_activated');
        }

        const password = await BcryptHelper.hashPassword(newPassword);

        await this._UserModel.updateOne(
            {
                _id: user._id,
            },
            {
                password,
                status: UserStatus.ACTIVE,
                verify: true,
            },
        );

        return new SuccessDto('active_successfully');
    }

    private async aggregateUser(query: mongoose.FilterQuery<User> = {}, pageOptions: PageOptionsDto = null) {
        const pipeline: mongoose.PipelineStage[] = [
            {
                $match: query,
            },
        ];

        if (pageOptions) {
            pipeline.push({
                $facet: {
                    metadata: [{ $count: 'total' }],
                    data: pageOptions.facetPipelines,
                },
            });
        } else {
            pipeline.push({
                $facet: {
                    metadata: [{ $count: 'total' }],
                    data: [{ $skip: 0 }, { $limit: 1 }],
                },
            });
        }

        pipeline.push({
            $addFields: {
                data: {
                    $map: {
                        input: '$data',
                        as: 'item',
                        in: {
                            $mergeObjects: [
                                '$$item',
                                {
                                    isManager: {
                                        $eq: ['$$item.role', UserRoles.MANAGER],
                                    },
                                    isSuperuser: {
                                        $eq: ['$$item.role', UserRoles.SUPERUSER],
                                    },
                                },
                            ],
                        },
                    },
                },
            },
        });

        const raw = await this._UserModel.aggregate(pipeline, { collation: { locale: 'en', strength: 3 } });
        const data = _.first(raw);
        const metadata: any = _.first(data.metadata) || {};
        return {
            ...data,
            metadata: {
                ...metadata,
                ...pageOptions,
            },
        };
    }
}
