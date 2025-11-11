import prismaClient from "../../Prisma";

interface UpdateStudentRequest {
  id: string;
  nome: string;
  curso: string;
  serie: string;
}

class UpdateStudentService {
  async execute({ id, nome, curso, serie }: UpdateStudentRequest) {
    const student = await prismaClient.aluno.update({
      where: {
        id: id, 
      },
      data: {
        nome,
        curso,
        serie,
      },
    });

    return student;
  }
}

export { UpdateStudentService };
