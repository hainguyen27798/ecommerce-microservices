import { ProductTypes } from '@/modules/product/constants';
import { ClothingDto } from '@/modules/product/dto/clothing.dto';
import { ElectronicDto } from '@/modules/product/dto/electronic.dto';

export const ProductSubtypeRegistry = {
    [ProductTypes.ELECTRONIC]: ElectronicDto,
    [ProductTypes.CLOTHING]: ClothingDto,
};
