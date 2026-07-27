import { createTransport, type Transporter } from 'nodemailer';
import {
  resetPasswordEmailHtml,
  resetPasswordEmailText,
} from './templates/reset-password-email';

const REQUIRED_ENV_VARS = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
] as const;

let transporter: Transporter | undefined;

function getTransporter(): Transporter {
  if (transporter) return transporter;

  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Password reset email is missing required environment variable(s): ${missing.join(', ')}. ` +
        'Set them in apps/api/.env and restart the server (env vars are only read at process startup).',
    );
  }

  transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

export async function sendPasswordResetEmail(to: string, url: string) {
  await getTransporter().sendMail({
    from: `Fonex Supply Limited <${process.env.SMTP_USER}>`,
    to,
    subject: 'Reset your Fonex admin password',
    html: resetPasswordEmailHtml(url),
    text: resetPasswordEmailText(url),
  });
}
