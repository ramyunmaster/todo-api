-- AlterTable
ALTER TABLE "User" ADD COLUMN     "age" INTEGER;

UPDATE "User" SET age = 25 WHERE age IS NULL;
