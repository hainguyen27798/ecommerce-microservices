import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('inventories')
@ApiTags('Inventories')
export class InventoryController {}
