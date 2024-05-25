import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Exclude()
export class ClothingDto {
    @Expose()
    @IsNotEmpty()
    brand: string;

    @Expose()
    @IsNotEmpty()
    size: string;

    @Expose()
    @IsNotEmpty()
    material: string;
}
