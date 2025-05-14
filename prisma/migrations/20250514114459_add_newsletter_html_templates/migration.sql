/*
  Warnings:

  - You are about to drop the column `locale` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Newsletter" ADD COLUMN     "htmlTemplateEn" TEXT,
ADD COLUMN     "htmlTemplateNo" TEXT;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "locale";
