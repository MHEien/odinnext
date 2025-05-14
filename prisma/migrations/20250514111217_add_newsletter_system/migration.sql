-- CreateEnum
CREATE TYPE "NewsletterStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENT', 'CANCELLED');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'no';

-- CreateTable
CREATE TABLE "Newsletter" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleNo" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "contentNo" TEXT NOT NULL,
    "isTranslatedAI" BOOLEAN NOT NULL DEFAULT false,
    "status" "NewsletterStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledFor" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterSubscription" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "locale" TEXT NOT NULL DEFAULT 'no',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsletterSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_NewsletterToNewsletterSubscription" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NewsletterToNewsletterSubscription_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscription_email_key" ON "NewsletterSubscription"("email");

-- CreateIndex
CREATE INDEX "_NewsletterToNewsletterSubscription_B_index" ON "_NewsletterToNewsletterSubscription"("B");

-- AddForeignKey
ALTER TABLE "NewsletterSubscription" ADD CONSTRAINT "NewsletterSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NewsletterToNewsletterSubscription" ADD CONSTRAINT "_NewsletterToNewsletterSubscription_A_fkey" FOREIGN KEY ("A") REFERENCES "Newsletter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NewsletterToNewsletterSubscription" ADD CONSTRAINT "_NewsletterToNewsletterSubscription_B_fkey" FOREIGN KEY ("B") REFERENCES "NewsletterSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
