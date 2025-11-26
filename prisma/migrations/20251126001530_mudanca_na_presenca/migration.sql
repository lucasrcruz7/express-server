/*
  Warnings:

  - A unique constraint covering the columns `[alunoId,data,curso,serie,turma]` on the table `Presenca` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Presenca_alunoId_data_key";

-- CreateIndex
CREATE UNIQUE INDEX "Presenca_alunoId_data_curso_serie_turma_key" ON "Presenca"("alunoId", "data", "curso", "serie", "turma");
