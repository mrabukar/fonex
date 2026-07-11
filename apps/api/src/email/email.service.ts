import { Injectable, Logger } from '@nestjs/common';
import { createTransport, type Transporter } from 'nodemailer';
import {
  contactNotificationHtml,
  contactNotificationText,
  type ContactNotification,
} from './templates/contact-notification';

const REQUIRED_ENV_VARS = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'CONTACT_NOTIFICATION_EMAIL',
] as const;

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter;
  private readonly sender: string;
  private readonly notificationEmail: string;

  constructor() {
    const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(
        `EmailService is missing required environment variable(s): ${missing.join(', ')}. ` +
          'Set them in apps/api/.env and restart the server (env vars are only read at process startup).',
      );
    }

    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    this.sender = process.env.SMTP_USER!;
    this.notificationEmail = process.env.CONTACT_NOTIFICATION_EMAIL!;
  }

  async sendContactNotification(submission: ContactNotification) {
    const siteUrl = (process.env.WEB_ORIGIN ?? 'http://localhost:3000').split(',')[0].trim();
    const productUrl = submission.productId ? `${siteUrl}/products/${submission.productId}` : undefined;

    await this.transporter.sendMail({
      from: `Fonex Supply Limited <${this.sender}>`,
      to: this.notificationEmail,
      replyTo: submission.email,
      subject: `New enquiry from ${submission.name}`,
      html: contactNotificationHtml(submission, productUrl),
      text: contactNotificationText(submission, productUrl),
    });
  }
}
