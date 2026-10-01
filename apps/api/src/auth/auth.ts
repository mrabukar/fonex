import { nodeENV } from './../../../../node_modules/@better-auth/core/src/env/env-impl';
import 'dotenv/config';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { sendPasswordResetEmail } from '../email/reset-password-mailer';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const webOrigins = (process.env.WEB_ORIGIN ?? 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const trustedOrigins = webOrigins;

const baseURLCanonical = process.env.BETTER_AUTH_URL ?? 'http://localhost:8000';
const baseURLProtocol = baseURLCanonical.startsWith('http://') ? 'http' : 'https';

function parseAllowedHost(originUrl: string): string | null {
  try {
    return new URL(originUrl).hostname;
  } catch {
    return null;
  }
}

const allowedHosts = Array.from(
  new Set(
    [
      ...webOrigins.map(parseAllowedHost).filter((h): h is string => Boolean(h)),
      parseAllowedHost(baseURLCanonical),
    ].filter((h): h is string => Boolean(h)),
  ),
);

export const auth = betterAuth({
  basePath: '/api/auth',
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: {
    allowedHosts,
    protocol: baseURLProtocol,
    fallback: baseURLCanonical,
  },
  trustedOrigins,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail(user.email, url);
    },
    revokeSessionsOnPasswordReset: true,
  },
  plugins: [
    admin({
      defaultRole: 'admin',
    }),
  ],
});
