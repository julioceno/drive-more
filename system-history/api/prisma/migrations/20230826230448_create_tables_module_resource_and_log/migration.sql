/*
  Warnings:

  - Added the required column `action` to the `logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entity_id` to the `logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payload` to the `logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resourceId` to the `logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `logs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Action" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'OTHER');

-- AlterTable
ALTER TABLE "logs" ADD COLUMN     "action" "Action" NOT NULL,
ADD COLUMN     "entity_id" TEXT NOT NULL,
ADD COLUMN     "payload" JSONB NOT NULL,
ADD COLUMN     "resourceId" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "modules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "modules_name_key" ON "modules"("name");

-- CreateIndex
CREATE UNIQUE INDEX "resources_name_module_id_key" ON "resources"("name", "module_id");

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
