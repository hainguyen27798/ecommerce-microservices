import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { PageOptionsDto } from '@/dto/core';
import { ProductDto } from '@/modules/product/dto/product.dto';
import { ProductService } from '@/modules/product/product.service';
import { Product } from '@/modules/product/schemas/product.schema';
import { FilterQueryType } from '@/types';

export class SearchProductsCommand implements ICommand {
    constructor(
        public readonly filter: FilterQueryType<Product>,
        public readonly pageOption: PageOptionsDto,
    ) {}
}

@CommandHandler(SearchProductsCommand)
export class SearchProductsHandler implements ICommandHandler<SearchProductsCommand, ProductDto[]> {
    constructor(private _ProductService: ProductService) {}

    async execute(command: SearchProductsCommand): Promise<ProductDto[]> {
        return this._ProductService.searchProducts(command.filter, command.pageOption);
    }
}
