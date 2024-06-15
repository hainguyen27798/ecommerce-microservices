import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class ClothingDto {
    @Expose()
    @IsString()
    @IsNotEmpty()
    brand: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    size: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    material: string;
}
