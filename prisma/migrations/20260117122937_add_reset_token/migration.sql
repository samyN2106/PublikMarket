/*
  Warnings:

  - A unique constraint covering the columns `[resetToken]` on the table `Boutique` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Boutique" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExp" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Boutique_resetToken_key" ON "Boutique"("resetToken");
