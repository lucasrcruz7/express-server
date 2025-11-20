import prismaClient from "../../Prisma";

interface UpdateProfRequest {
  id: string;
  nome: string;
  email: string;
  senha?: string;
}

class UpdateProfService {
  async execute({ id, nome, email, senha }: UpdateProfRequest) {
    const data: any = { nome, email };
    if (senha) data.senha = senha;

    const professor = await prismaClient.professor.update({
      where: { id },
      data,
    });

    return professor;
  }
}

export { UpdateProfService };
