/*
  Warnings:

  - You are about to drop the column `billingAddress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddress` on the `Order` table. All the data in the column will be lost.
  - Added the required column `billing_address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_method` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_address` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "billingAddress",
DROP COLUMN "paymentMethod",
DROP COLUMN "shippingAddress",
ADD COLUMN     "billing_address" JSONB NOT NULL,
ADD COLUMN     "payment_method" JSONB NOT NULL,
ADD COLUMN     "shipping_address" JSONB NOT NULL;
