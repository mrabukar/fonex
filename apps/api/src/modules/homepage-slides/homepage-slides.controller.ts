import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AllowAnonymous, Roles } from '@thallesp/nestjs-better-auth';
import { HomepageSlidesService } from './homepage-slides.service';
import {
  HomepageSettingsDto,
  HomepageSlideDto,
  ImageUploadRequestDto,
  ReorderHomepageSlidesDto,
  UpdateHomepageSlideDto,
} from './homepage-slide.dto';

@Controller('homepage-slides')
export class HomepageSlidesController {
  constructor(private readonly homepageSlidesService: HomepageSlidesService) {}

  @Get()
  @AllowAnonymous()
  findVisible() {
    return this.homepageSlidesService.findVisible();
  }

  @Get('admin')
  @Roles(['admin'])
  findAllForAdmin() {
    return this.homepageSlidesService.findAllForAdmin();
  }

  @Post()
  @Roles(['admin'])
  create(@Body() body: HomepageSlideDto) {
    return this.homepageSlidesService.create(body);
  }

  @Patch('reorder')
  @Roles(['admin'])
  reorder(@Body() body: ReorderHomepageSlidesDto) {
    return this.homepageSlidesService.reorder(body);
  }

  @Patch(':id')
  @Roles(['admin'])
  update(@Param('id') id: string, @Body() body: UpdateHomepageSlideDto) {
    return this.homepageSlidesService.update(id, body);
  }

  @Post(':id/image-upload-url')
  @Roles(['admin'])
  createImageUploadUrl(@Param('id') id: string, @Body() body: ImageUploadRequestDto) {
    return this.homepageSlidesService.createImageUploadUrl(id, body.contentType);
  }

  @Delete(':id')
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.homepageSlidesService.remove(id);
  }
}

@Controller('homepage-settings')
export class HomepageSettingsController {
  constructor(private readonly homepageSlidesService: HomepageSlidesService) {}

  @Get()
  @AllowAnonymous()
  getSettings() {
    return this.homepageSlidesService.getSettings();
  }

  @Patch()
  @Roles(['admin'])
  updateSettings(@Body() body: HomepageSettingsDto) {
    return this.homepageSlidesService.updateSettings(body);
  }
}
