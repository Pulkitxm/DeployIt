/*
  Warnings:

  - The `logs` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "size" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "logs",
ADD COLUMN     "logs" JSONB[];

-- CreateIndex
CREATE INDEX "slug" ON "Project"("slug");
