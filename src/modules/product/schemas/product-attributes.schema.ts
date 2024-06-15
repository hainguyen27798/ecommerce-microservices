import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ProductAttributes {
    @Prop({ required: true })
    key: string;

    @Prop({ required: true })
    value: string;
}

export const ProductAttributesSchema = SchemaFactory.createForClass(ProductAttributes);
