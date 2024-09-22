import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import * as csv from 'csvtojson';
import { nanoid } from 'nanoid';
import { EnhancementService } from '../serivces/enhancement.service';
import { Product, Option } from './product.types';
import { CronExpression, Cron } from '@nestjs/schedule';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository, private enhancementsService: EnhancementService) { }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async importProducts(filePath: string = './images30.txt'): Promise<void> {
    console.log('Running import products function: ', new Date().toLocaleString())
    const products = await this.parseCSVToJson(filePath);
    const formattedProducts = this.mapToProductFormat(products);
    await this.enhancementsService.enhanceDescriptions(formattedProducts)
    this.upsertProductsInBatches(formattedProducts, 200);
    console.log('Finished importing products: ', new Date().toLocaleString())
  }

  async parseCSVToJson(filePath: string): Promise<Product[]> {
    const options = {
      delimiter: '\t',
      trim: true,
    };
    return csv(options).fromFile(filePath);
  }

  mapToProductFormat(products: any[]): Product[] {
    const productMap: { [key: string]: any } = {};

    products.forEach((product) => {
      const productId = product.ProductID;

      let existingProduct = productMap[productId];
      if (!existingProduct) {
        existingProduct = {
          productId,
          docId: nanoid(4),
          name: product.ProductName,
          type: 'non-inventory',
          shortDescription: '',
          description: product.ProductDescription || '',
          categoryName: product.CategoryName,
          vendorId: product.ManufacturerID || '',
          manufacturerId: product.ManufacturerID || '',
          storefrontPriceVisibility: 'members-only',
          variants: [],
          options: [],
          status: 'active',
        };
        productMap[productId] = existingProduct;
      }

      const variant = {
        id: nanoid(),
        available: true,
        attributes: {},
        cost: isNaN(parseFloat(product.UnitPrice)) ? 0 : parseFloat(product.UnitPrice),
        currency: 'USD',
        description: product.ItemDescription || product.ProductName,
        packaging: product.PKG,
        price: isNaN(parseFloat(product.UnitPrice)) ? 0 : parseFloat(product.UnitPrice),
        sku: product.ManufacturerItemCode || '',
        active: true,
        images: [
          {
            fileName: product.ImageFileName || '',
            cdnLink: product.ItemImageURL || '',
            i: 0,
            alt: null,
          },
        ],
      };

      existingProduct.variants.push(variant);

      if (!existingProduct.options.some((opt: Option) => opt.name === 'packaging')) {
        existingProduct.options.push({
          name: 'packaging',
          values: [{ id: nanoid(4), name: variant.packaging, value: variant.packaging }],
          id: nanoid(4),
          dataField: null,
        });
      }

      if (!existingProduct.options.some((opt: Option) => opt.name === 'description')) {
        existingProduct.options.push({
          name: 'description',
          values: [{ id: nanoid(4), name: variant.description, value: variant.description }],
          id: nanoid(4),
          dataField: null,
        });
      }
    });

    return Object.values(productMap);
  }

  async upsertProductsInBatches(products: Product[], batchSize: number): Promise<void> {
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      await this.productRepository.upsertProducts(batch);
    }
  }
}
