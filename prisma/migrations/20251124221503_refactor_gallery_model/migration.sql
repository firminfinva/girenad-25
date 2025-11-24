/*
  Warnings:

  - You are about to drop the column `altText` on the `galleries` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `galleries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "galleries" DROP COLUMN "altText",
DROP COLUMN "imageUrl";

-- CreateTable
CREATE TABLE "gallery_images" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "altText" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "galleryId" TEXT NOT NULL,

    CONSTRAINT "gallery_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
