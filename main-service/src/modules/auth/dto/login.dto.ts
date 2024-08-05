import { OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { AccountDto } from '@/modules/auth/dto/account.dto';

@Exclude()
export class LoginDto extends OmitType(AccountDto, ['name']) {}
