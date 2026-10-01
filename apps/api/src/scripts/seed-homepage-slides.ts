import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const SETTINGS_ID = 'default';

/**
 * Existing public-folder banners. Kept as local `/images/new/...` URLs on
 * purpose: uploading them to R2 would require credentials at seed time and
 * would crop/re-encode photos the homepage already shows correctly.
 * New admin uploads go to R2; these stay until the admin replaces one.
 */
const slides = [
  {
    title: 'Wireless earbuds — four colors',
    imageUrl: '/images/new/1-e4ec4854a5-p9cm5zs.webp',
    imageDescription: 'Wireless earbuds with charging case — blue, white, black, and rose gold',
    bg: '#FFFFFF',
  },
  {
    title: 'Security display stand with alarm',
    imageUrl: '/images/new/17066330c08334e8cf01cb23f4db7c33.jpg.jpeg',
    imageDescription: 'Security display stand with alarm for mobile phones',
    bg: '#B4D1E8',
  },
  {
    title: 'Wireless earbuds — black',
    imageUrl: '/images/new/440x440-1000x1000.png',
    imageDescription: 'Wireless earbuds charging case — black',
    bg: '#FFFFFF',
  },
  {
    title: 'Wireless earbuds — silver',
    imageUrl: '/images/new/51IUDy2NLRL._AC_UF1000,1000_QL80_.jpg.jpeg',
    imageDescription: 'Wireless earbuds charging case — silver',
    bg: '#FFFFFF',
  },
  {
    title: 'Anti-theft security display stand',
    imageUrl: '/images/new/Cell-Phone-Alarm-Stand-Security-Display-Anti-Theft-Device-for-Mobile-Phone.webp',
    imageDescription: 'Anti-theft security display stand for mobile phones',
    bg: '#EBE9E7',
  },
  {
    title: 'Security display stand',
    imageUrl: '/images/new/htb1hyc3jfxxxxxoxxxxq6xxfxxx5.jpg.jpeg',
    imageDescription: 'Security display stand with mobile phone',
    bg: '#FFFFFF',
  },
  {
    title: 'HUAWEI FreeClip 2',
    imageUrl: '/images/new/HUAWEI-FreeClip-2-Teaser-C-bridge-Design-2.jpeg',
    imageDescription: 'HUAWEI FreeClip 2 open-ear earbuds — blue, white, black, and pink',
    bg: '#FFFFFF',
  },
  {
    title: 'Security stand — rear view',
    imageUrl: '/images/new/images (1).jpg.jpeg',
    imageDescription: 'Security display stand with mobile phone, rear view',
    bg: '#DBFBF4',
  },
  {
    title: 'Open-ear earbuds — rose gold',
    imageUrl: '/images/new/images (11).jpg.jpeg',
    imageDescription: 'Open-ear earbuds charging case — rose gold',
    bg: '#EDEDED',
  },
  {
    title: 'Open-ear earbuds — black',
    imageUrl: '/images/new/images (12).jpg.jpeg',
    imageDescription: 'Open-ear earbuds charging case — black',
    bg: '#FFFFFF',
  },
  {
    title: 'Open-ear earbuds — purple',
    imageUrl: '/images/new/images (4).jpg.jpeg',
    imageDescription: 'Open-ear earbuds charging case — purple',
    bg: '#FFFFFF',
  },
  {
    title: 'Open-ear earbuds — beige',
    imageUrl: '/images/new/images (5).jpg.jpeg',
    imageDescription: 'Open-ear earbuds charging case — beige',
    bg: '#FFFFFF',
  },
  {
    title: 'Open-ear earbuds — four colors',
    imageUrl: '/images/new/images (6).jpg.jpeg',
    imageDescription: 'Open-ear earbuds — pink, black, purple, and beige',
    bg: '#FFFFFF',
  },
  {
    title: 'HUAWEI open-ear earbuds',
    imageUrl: '/images/new/images (7).jpg.jpeg',
    imageDescription: 'HUAWEI open-ear earbuds — white, black, and blue',
    bg: '#554032',
  },
  {
    title: 'Security stand with iPhone — rear',
    imageUrl: '/images/new/IMG-20260810-WA0028(1).jpg.jpeg',
    imageDescription: 'Security display stand with iPhone, rear view',
    bg: '#FFFFFF',
  },
  {
    title: 'Security stand with price tag',
    imageUrl: '/images/new/IMG-20260810-WA0029(1).jpg.jpeg',
    imageDescription: 'Security display stand with price tag holder, shown with iPhone 15 Pro',
    bg: '#FFFFFF',
  },
  {
    title: 'Price tag holder',
    imageUrl: '/images/new/IMG-20260810-WA0030(1).jpg.jpeg',
    imageDescription: 'Price tag holder for security display stand — iPhone 15 Pro spec card',
    bg: '#FFFFFF',
  },
  {
    title: 'Security stand with price tag — front',
    imageUrl: '/images/new/IMG-20260810-WA0031(1).jpg.jpeg',
    imageDescription: 'Security display stand with price tag holder, front view, shown with iPhone 15 Pro',
    bg: '#FFFFFF',
  },
  {
    title: 'Security stand with price tag — angled',
    imageUrl: '/images/new/IMG-20260810-WA0032(1).jpg.jpeg',
    imageDescription: 'Security display stand with price tag holder, angled view, shown with iPhone 15 Pro',
    bg: '#FFFFFF',
  },
  {
    title: 'Acrylic sign holder — A5',
    imageUrl: '/images/new/images (4n).jpg.jpeg',
    imageDescription: 'Acrylic slanted sign holder, A5 size — 6-pack',
    bg: '#FFFFFF',
  },
  {
    title: 'Acrylic sign holder — 8.5 x 11',
    imageUrl: '/images/new/images (5n).jpg.jpeg',
    imageDescription: 'Acrylic slanted sign holder, 8.5" x 11" — 6-pack',
    bg: '#FFFFFF',
  },
  {
    title: 'Acrylic sign holder — 8.5 x 11 pack',
    imageUrl: '/images/new/images (6n).jpg.jpeg',
    imageDescription: 'Acrylic slanted sign holder, 8.5" x 11" — 6-pack',
    bg: '#FFFFFF',
  },
];

async function main() {
  await prisma.homepageSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID, autoplayMs: 3000 },
  });
  console.log('Seeded homepage settings');

  const existing = await prisma.homepageSlide.count();
  if (existing > 0) {
    console.log(`Skipping slide seed — ${existing} homepage image(s) already exist.`);
    return;
  }

  await prisma.homepageSlide.createMany({
    data: slides.map((slide, order) => ({
      ...slide,
      order,
      isActive: true,
    })),
  });
  console.log(`Seeded ${slides.length} homepage images`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
