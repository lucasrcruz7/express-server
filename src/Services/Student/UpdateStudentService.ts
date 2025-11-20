import prismaClient from "../../Prisma";

interface UpdateStudentRequest {
  id: string;
  nome: string;
  curso: string;
  serie: string;
  turma: string
  ativo: boolean
}

class UpdateStudentService {
  async execute({ id, nome, curso, serie, turma, ativo }: UpdateStudentRequest) {
    const student = await prismaClient.aluno.update({
      where: {
        id: id, 
      },
      data: {
        nome,
        curso,
        serie,
        turma,
        ativo
      },
    });

    return student;
  }
}

export { UpdateStudentService };
