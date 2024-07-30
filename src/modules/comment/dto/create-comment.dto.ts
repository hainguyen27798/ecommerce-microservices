import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

@Exclude()
export class CreateCommentDto {
    @Expose()
    @ApiProperty()
    @IsMongoId()
    product: string;

    @Expose()
    @ApiProperty()
    @IsString()
    content: string;

    @Expose()
    @ApiProperty()
    @IsMongoId()
    @IsOptional()
    replyTo: string;
}
