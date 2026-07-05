import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AllowAnonymous, Roles } from '@thallesp/nestjs-better-auth';
import { CategoriesService } from './categories.service';
import { CategoriesListQueryDto, CategoryDto, UpdateCategoryDto } from './category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @AllowAnonymous()
  findAll(@Query() query: CategoriesListQueryDto) {
    return this.categoriesService.findAll(query);
  }

  @Post()
  @Roles(['admin'])
  create(@Body() body: CategoryDto) {
    return this.categoriesService.create(body);
  }

  @Patch(':id')
  @Roles(['admin'])
  update(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
    return this.categoriesService.update(id, body);
  }

  @Delete(':id')
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
