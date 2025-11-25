import prismaClient from "../../Prisma";
import { hash, compare } from "bcryptjs";

interface ChangePasswordRequest {
  id: string;
  senhaAtual: string;
  novaSenha: string;
}

class ChangePasswordProfService {
  async execute({ id, senhaAtual, novaSenha }: ChangePasswordRequest) {
    if (!senhaAtual || !novaSenha) {
      throw new Error("Senha atual e nova senha são obrigatórias");
    }

    if (novaSenha.length < 6) {
      throw new Error("Senha deve ter no mínimo 6 caracteres");
    }

    const professorExists = await prismaClient.professor.findUnique({
      where: { id },
    });

    if (!professorExists) {
      throw new Error("Professor não encontrado");
    }

    const senhaCorreta = await compare(senhaAtual, professorExists.senha);

    if (!senhaCorreta) {
      throw new Error("Senha atual incorreta");
    }

    const senhaHash = await hash(novaSenha, 8);

    const professor = await prismaClient.professor.update({
      where: { id },
      data: { senha: senhaHash },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });

    return professor;
  }
}

export { ChangePasswordProfService };
