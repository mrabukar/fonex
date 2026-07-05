import { contactSchema } from '@fonex/shared';
import { createZodDto } from 'nestjs-zod';

export class ContactDto extends createZodDto(contactSchema) {}
