/*
  Warnings:

  - You are about to drop the column `supabaseId` on the `Boutique` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Boutique_supabaseId_key";

-- AlterTable
ALTER TABLE "Boutique" DROP COLUMN "supabaseId";
