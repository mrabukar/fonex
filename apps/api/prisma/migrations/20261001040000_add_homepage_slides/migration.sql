-- CreateTable
CREATE TABLE "homepage_slide" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imageDescription" TEXT,
    "caption" TEXT,
    "bg" TEXT NOT NULL DEFAULT '#FFFFFF',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "productId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_slide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homepage_settings" (
    "id" TEXT NOT NULL,
    "autoplayMs" INTEGER NOT NULL DEFAULT 3000,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "homepage_slide_order_idx" ON "homepage_slide"("order");

-- CreateIndex
CREATE INDEX "homepage_slide_productId_idx" ON "homepage_slide"("productId");

-- AddForeignKey
ALTER TABLE "homepage_slide" ADD CONSTRAINT "homepage_slide_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed the settings singleton so public GET never 404s before the seed script runs.
INSERT INTO "homepage_settings" ("id", "autoplayMs", "updatedAt")
VALUES ('default', 3000, CURRENT_TIMESTAMP);
