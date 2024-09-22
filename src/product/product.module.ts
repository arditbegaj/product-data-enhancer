import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import PostsController from './product.controller';
import { ProductService } from './product.service';
import { Product, ProductSchema } from './product.schema';
import { ProductRepository } from './product.repository';
import { EnhancementService } from '../serivces/enhancement.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [PostsController],
  providers: [ProductService, ProductRepository, EnhancementService],
  exports: [ProductService],
})
class ProductModule { }

export default ProductModule;
