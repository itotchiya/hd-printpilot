-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'completed';

-- CreateIndex
CREATE INDEX "Quote_status_idx" ON "Quote"("status");
