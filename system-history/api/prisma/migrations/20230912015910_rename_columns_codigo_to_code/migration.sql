/*
  Warnings:

  - You are about to drop the column `codigo` on the `modules` table. All the data in the column will be lost.
  - You are about to drop the column `codigo` on the `records` table. All the data in the column will be lost.
  - You are about to drop the column `codigo` on the `resources` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `modules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `records` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `resources` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "modules_codigo_key";

-- DropIndex
DROP INDEX "records_codigo_key";

-- DropIndex
DROP INDEX "resources_codigo_key";

-- AlterTable
ALTER TABLE "modules" DROP COLUMN "codigo",
ADD COLUMN     "code" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "records" DROP COLUMN "codigo",
ADD COLUMN     "code" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "resources" DROP COLUMN "codigo",
ADD COLUMN     "code" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "modules_code_key" ON "modules"("code");

-- CreateIndex
CREATE UNIQUE INDEX "records_code_key" ON "records"("code");

-- CreateIndex
CREATE UNIQUE INDEX "resources_code_key" ON "resources"("code");
