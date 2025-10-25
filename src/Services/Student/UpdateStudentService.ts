import prismaClient from "../../Prisma";

interface UpdateUserRequest {
  id: string;
  nome: string;
  curso: string;
  serie: string;
}

class UpdateUserService {
  async execute({ id, nome, curso, serie }: UpdateUserRequest) {
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

export { UpdateUserService };
