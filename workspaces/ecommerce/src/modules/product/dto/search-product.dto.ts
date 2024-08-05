import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@Exclude()
export class SearchProductDto {
    @Expose()
    @Transform(({ value }) => value === 'true')
    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    publishedOnly: boolean;

    @Expose()
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    search: string;
}
