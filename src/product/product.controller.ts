import {
  Controller,
  Get,
} from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export default class ProductsController {
  constructor(private readonly productService: ProductService) { }

  @Get('')
  async importProducts() {
    return this.productService.importProducts('./images30.txt');
  }

}
