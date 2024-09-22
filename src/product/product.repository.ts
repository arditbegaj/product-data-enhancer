import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';
import { Product as ProductType } from './product.types';

@Injectable()
export class ProductRepository {
    constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>) { }

    async upsertProducts(products: ProductType[]) {
        const operations = products.map(product => ({
            updateOne: {
                filter: { productId: product.productId },
                update: { $set: product, $setOnInsert: { docId: product.docId } },
                upsert: true,
            },
        }));
        try {
            return await this.productModel.bulkWrite(operations);
        } catch (error) {
            console.error('Bulk write error:', error);
            throw error;
        }
    }

}
