/*
  Warnings:

  - You are about to drop the column `token` on the `Aluno` table. All the data in the column will be lost.
  - You are about to drop the column `aulaId` on the `Presenca` table. All the data in the column will be lost.
  - You are about to drop the `Aula` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[alunoId,data]` on the table `Presenca` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `Presenca` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Presenca" DROP CONSTRAINT "Presenca_aulaId_fkey";

-- AlterTable
ALTER TABLE "Aluno" DROP COLUMN "token";

-- AlterTable
ALTER TABLE "Presenca" DROP COLUMN "aulaId",
ADD COLUMN     "token" TEXT NOT NULL,
ALTER COLUMN "data" DROP DEFAULT;

-- DropTable
DROP TABLE "public"."Aula";

-- CreateIndex
CREATE UNIQUE INDEX "Presenca_alunoId_data_key" ON "Presenca"("alunoId", "data");
