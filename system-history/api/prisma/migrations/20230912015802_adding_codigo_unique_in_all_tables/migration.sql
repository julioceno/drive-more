/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `modules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `records` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `resources` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "modules_codigo_key" ON "modules"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "records_codigo_key" ON "records"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "resources_codigo_key" ON "resources"("codigo");
