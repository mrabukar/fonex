import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const categories = [
  { name: 'Flagship', slug: 'flagship' },
  { name: 'Mid-Range', slug: 'midrange' },
  { name: 'Accessories', slug: 'accessories' },
  { name: 'Wearables', slug: 'wearables' },
  { name: 'Spare Parts', slug: 'parts' },
];

async function main() {
  for (const category of categories) {
    const result = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
    console.log('Seeded category:', result.slug);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
