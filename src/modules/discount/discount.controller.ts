import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('discounts')
@ApiTags('Discounts')
export class DiscountController {}
