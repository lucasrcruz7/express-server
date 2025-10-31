/*
  Warnings:

  - Added the required column `aulaId` to the `Presenca` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Aluno_token_key";

-- AlterTable
ALTER TABLE "Presenca" ADD COLUMN     "aulaId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Aula" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aula_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Aula_data_key" ON "Aula"("data");

-- AddForeignKey
ALTER TABLE "Presenca" ADD CONSTRAINT "Presenca_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "Aula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
