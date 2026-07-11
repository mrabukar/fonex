import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const EXTENSIONS_BY_CONTENT_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const REQUIRED_ENV_VARS = [
  'R2_ENDPOINT',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
  'R2_PUBLIC_URL',
] as const;

@Injectable()
export class R2Service {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor() {
    const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(
        `R2Service is missing required environment variable(s): ${missing.join(', ')}. ` +
          'Set them in apps/api/.env and restart the server (env vars are only read at process startup).',
      );
    }

    const endpoint = process.env.R2_ENDPOINT!;
    const publicUrl = process.env.R2_PUBLIC_URL!;
    if (publicUrl.replace(/\/+$/, '') === endpoint.replace(/\/+$/, '')) {
      throw new Error(
        'R2_PUBLIC_URL is set to the same value as R2_ENDPOINT — that\'s the private R2 API endpoint, ' +
          "not a public URL. Enable the bucket's Public Development URL (or a custom domain) in the " +
          'Cloudflare dashboard and put that value in R2_PUBLIC_URL instead.',
      );
    }

    this.client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
    this.bucket = process.env.R2_BUCKET_NAME!;
    this.publicUrl = publicUrl.replace(/\/+$/, '');
  }

  async createUploadUrl(contentType: string, prefix: string) {
    const key = `${prefix}/${randomUUID()}.${EXTENSIONS_BY_CONTENT_TYPE[contentType]}`;
    const uploadUrl = await getSignedUrl(
      this.client,
      new PutObjectCommand({ Bucket: this.bucket, Key: key, ContentType: contentType }),
      { expiresIn: 300 },
    );
    return { uploadUrl, publicUrl: `${this.publicUrl}/${key}` };
  }

  async deleteByPublicUrl(url: string) {
    if (!this.publicUrl || !url.startsWith(`${this.publicUrl}/`)) return;
    const key = url.slice(this.publicUrl.length + 1);
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }
}
