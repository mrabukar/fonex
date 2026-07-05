import { Body, Controller, Post } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ContactService } from './contact.service';
import { ContactDto } from './contact.dto';

@Controller('contact')
@AllowAnonymous()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  submit(@Body() body: ContactDto) {
    return this.contactService.submit(body);
  }
}
