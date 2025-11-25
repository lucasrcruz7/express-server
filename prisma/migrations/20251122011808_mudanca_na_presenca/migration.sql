/*
  Warnings:

  - Added the required column `curso` to the `Presenca` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serie` to the `Presenca` table without a default value. This is not possible if the table is not empty.
  - Added the required column `turma` to the `Presenca` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Presenca" ADD COLUMN     "curso" TEXT NOT NULL,
ADD COLUMN     "serie" TEXT NOT NULL,
ADD COLUMN     "turma" TEXT NOT NULL;
