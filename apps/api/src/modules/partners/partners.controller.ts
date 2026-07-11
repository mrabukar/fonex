import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AllowAnonymous, Roles } from '@thallesp/nestjs-better-auth';
import { PartnersService } from './partners.service';
import { ImageUploadRequestDto, PartnerDto, PartnersListQueryDto, UpdatePartnerDto } from './partner.dto';

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get()
  @AllowAnonymous()
  findAll(@Query() query: PartnersListQueryDto) {
    return this.partnersService.findAll(query);
  }

  @Get(':id')
  @AllowAnonymous()
  findOne(@Param('id') id: string) {
    return this.partnersService.findOne(id);
  }

  @Post()
  @Roles(['admin'])
  create(@Body() body: PartnerDto) {
    return this.partnersService.create(body);
  }

  @Patch(':id')
  @Roles(['admin'])
  update(@Param('id') id: string, @Body() body: UpdatePartnerDto) {
    return this.partnersService.update(id, body);
  }

  @Post(':id/logo-upload-url')
  @Roles(['admin'])
  createLogoUploadUrl(@Param('id') id: string, @Body() body: ImageUploadRequestDto) {
    return this.partnersService.createLogoUploadUrl(id, body.contentType);
  }

  @Delete(':id')
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.partnersService.remove(id);
  }
}
