/*
  Warnings:

  - You are about to drop the `categorys` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToInstructor" DROP CONSTRAINT "_CategoryToInstructor_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToStudent" DROP CONSTRAINT "_CategoryToStudent_A_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_categoryId_fkey";

-- DropTable
DROP TABLE "categorys";

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "code" SERIAL NOT NULL,
    "acronym" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_code_key" ON "categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "categories_acronym_key" ON "categories"("acronym");

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToInstructor" ADD CONSTRAINT "_CategoryToInstructor_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToStudent" ADD CONSTRAINT "_CategoryToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
