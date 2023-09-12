/*
  Warnings:

  - You are about to drop the column `codigo` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "codigo",
ADD COLUMN     "code" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_code_key" ON "users"("code");
