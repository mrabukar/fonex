import { Injectable, Logger } from '@nestjs/common';
import type { ContactInput } from '@fonex/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../../email/email.service';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {}

  async submit(input: ContactInput) {
    const submission = await this.prisma.contactSubmission.create({ data: input });

    try {
      const product = input.productId
        ? await this.prisma.product.findUnique({
            where: { id: input.productId },
            select: { name: true },
          })
        : null;

      await this.email.sendContactNotification({
        ...input,
        id: submission.id,
        productName: product?.name,
      });
    } catch (error) {
      this.logger.warn(`Failed to send notification email for submission ${submission.id}: ${error}`);
    }

    return { received: true, id: submission.id };
  }
}
