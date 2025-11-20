import prismaClient from "../../Prisma";

interface DeleteStudentRequest {
  id: string;
}

class DeleteStudentService {
  async execute({ id }: DeleteStudentRequest) {
    const student = await prismaClient.aluno.update({
      where: {
        id: id,
      },
      data: {
        ativo: false,
      },
    });

    return student;
  }
}

export { DeleteStudentService };
