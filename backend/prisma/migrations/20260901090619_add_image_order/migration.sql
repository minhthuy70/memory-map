-- AlterTable
ALTER TABLE "memory_images" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "memory_images_memory_id_order_idx" ON "memory_images"("memory_id", "order");
