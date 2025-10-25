import prismaClient from "../../Prisma";

interface DeleteUserRequest {
  id: string;
}

class DeleteUserService {
  async execute({ id }: DeleteUserRequest) {
    const student = await prismaClient.aluno.delete({
      where: {
        id: id,
      },
    });

    return student;
  }
}

export { DeleteUserService };
