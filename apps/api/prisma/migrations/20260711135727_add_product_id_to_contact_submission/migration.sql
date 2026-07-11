-- AlterTable
ALTER TABLE "ContactSubmission" ADD COLUMN     "productId" TEXT;

-- CreateIndex
CREATE INDEX "ContactSubmission_productId_idx" ON "ContactSubmission"("productId");

-- AddForeignKey
ALTER TABLE "ContactSubmission" ADD CONSTRAINT "ContactSubmission_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
