import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AllowAnonymous, Roles } from '@thallesp/nestjs-better-auth';
import { NewsService } from './news.service';
import {
  ImageUploadRequestDto,
  NewsAdminListQueryDto,
  NewsDto,
  NewsListQueryDto,
  UpdateNewsDto,
} from './news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @AllowAnonymous()
  findPublished(@Query() query: NewsListQueryDto) {
    return this.newsService.findPublished(query);
  }

  @Get('admin')
  @Roles(['admin'])
  findAllForAdmin(@Query() query: NewsAdminListQueryDto) {
    return this.newsService.findAllForAdmin(query);
  }

  @Get(':slug')
  @AllowAnonymous()
  findOneBySlug(@Param('slug') slug: string) {
    return this.newsService.findPublishedBySlug(slug);
  }

  @Post()
  @Roles(['admin'])
  create(@Body() body: NewsDto) {
    return this.newsService.create(body);
  }

  @Patch(':id')
  @Roles(['admin'])
  update(@Param('id') id: string, @Body() body: UpdateNewsDto) {
    return this.newsService.update(id, body);
  }

  @Post(':id/image-upload-url')
  @Roles(['admin'])
  createImageUploadUrl(@Param('id') id: string, @Body() body: ImageUploadRequestDto) {
    return this.newsService.createImageUploadUrl(id, body.contentType);
  }

  @Delete(':id')
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
