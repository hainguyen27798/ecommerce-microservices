import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';

import {
    ActiveUserHandler,
    CreateUserHandler,
    FindUserByHandler,
    VerifyOrCreateSocialUserHandler,
} from '@/modules/user/commands';
import { User, UserSchema } from '@/modules/user/schemas/user.schema';

import { UserController } from './user.controller';
import { UserService } from './user.service';

const handler = [FindUserByHandler, ActiveUserHandler, CreateUserHandler, VerifyOrCreateSocialUserHandler];

@Module({
    providers: [UserService, ...handler],
    controllers: [UserController],
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
        ]),
        CqrsModule,
    ],
})
export class UserModule {}
