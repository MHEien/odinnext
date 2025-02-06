/*
  Warnings:

  - Added the required column `longDescription` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nutritionalInfo` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "allergens" TEXT[],
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "inStock" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ingredients" TEXT[],
ADD COLUMN     "longDescription" TEXT NOT NULL,
ADD COLUMN     "nutritionalInfo" JSONB NOT NULL,
ADD COLUMN     "weight" INTEGER NOT NULL;
