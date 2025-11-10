import prismaClient from "../../Prisma";

interface DeleteStudentRequest {
  id: string;
}

class DeleteStudentService {
  async execute({ id }: DeleteStudentRequest) {
    const student = await prismaClient.aluno.delete({
      where: {
        id: id,
      },
    });

    return student;
  }
}

export { DeleteStudentService };
