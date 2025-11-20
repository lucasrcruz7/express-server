import prismaClient from "../../Prisma";

interface DeleteProfRequest {
  id: string;
}

class DeleteProfService {
  async execute({ id }: DeleteProfRequest) {
    const professor = await prismaClient.professor.delete({
      where: { id },
    });

    return professor;
  }
}

export { DeleteProfService };
