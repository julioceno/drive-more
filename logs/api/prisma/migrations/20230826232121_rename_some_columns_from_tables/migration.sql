/*
  Warnings:

  - You are about to drop the column `resourceId` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `logs` table. All the data in the column will be lost.
  - Added the required column `creator_email` to the `logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resource_id` to the `logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "logs" DROP CONSTRAINT "logs_resourceId_fkey";

-- AlterTable
ALTER TABLE "logs" DROP COLUMN "resourceId",
DROP COLUMN "username",
ADD COLUMN     "creator_email" TEXT NOT NULL,
ADD COLUMN     "resource_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
