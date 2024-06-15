import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class ElectronicDto {
    @Expose()
    @IsString()
    @IsNotEmpty()
    manufacturer: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    model: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    color: string;
}
