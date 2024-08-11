import { OmitType, PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { CreateUserDto } from '@/modules/user/dto/create-user.dto';

@Exclude()
export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['email'])) {}
