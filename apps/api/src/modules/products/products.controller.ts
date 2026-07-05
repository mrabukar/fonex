import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AllowAnonymous, Roles } from '@thallesp/nestjs-better-auth';
import { ProductsService } from './products.service';
import { ImageUploadRequestDto, ProductDto, ProductsListQueryDto, UpdateProductDto } from './product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @AllowAnonymous()
  findAll(@Query() query: ProductsListQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @AllowAnonymous()
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @Roles(['admin'])
  create(@Body() body: ProductDto) {
    return this.productsService.create(body);
  }

  @Patch(':id')
  @Roles(['admin'])
  update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.productsService.update(id, body);
  }

  @Post(':id/image-upload-url')
  @Roles(['admin'])
  createImageUploadUrl(@Param('id') id: string, @Body() body: ImageUploadRequestDto) {
    return this.productsService.createImageUploadUrl(id, body.contentType);
  }

  @Delete(':id')
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
