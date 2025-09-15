-- AlterTable
ALTER TABLE "public"."Make" ADD COLUMN     "popular" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Model" ADD COLUMN     "popular" BOOLEAN NOT NULL DEFAULT false;
