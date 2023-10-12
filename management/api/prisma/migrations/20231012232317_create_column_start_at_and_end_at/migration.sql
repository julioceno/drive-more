/*
  Warnings:

  - You are about to drop the column `class_date` on the `classes` table. All the data in the column will be lost.
  - Added the required column `end_at` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_at` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "classes" DROP COLUMN "class_date",
ADD COLUMN     "end_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_at" TIMESTAMP(3) NOT NULL;
