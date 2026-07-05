import { Injectable } from '@nestjs/common';
import type { ContactInput } from '@fonex/shared';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async submit(input: ContactInput) {
    const submission = await this.prisma.contactSubmission.create({ data: input });
    return { received: true, id: submission.id };
  }
}
