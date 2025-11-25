import prismaClient from "../../Prisma";
import { hash, compare } from "bcryptjs";

interface ChangePasswordRequest {
  id: string;
  senhaAtual: string;
  novaSenha: string;
}

class ChangePasswordStudentService {
  async execute({ id, senhaAtual, novaSenha }: ChangePasswordRequest) {
    if (!senhaAtual || !novaSenha) {
      throw new Error("Senha atual e nova senha são obrigatórias");
    }

    if (novaSenha.length < 6) {
      throw new Error("Senha deve ter no mínimo 6 caracteres");
    }

    const studentExists = await prismaClient.aluno.findUnique({
      where: { id },
    });

    if (!studentExists) {
      throw new Error("Aluno não encontrado");
    }

    const senhaCorreta = await compare(senhaAtual, studentExists.senha);

    if (!senhaCorreta) {
      throw new Error("Senha atual incorreta");
    }

    const senhaHash = await hash(novaSenha, 8);

    const student = await prismaClient.aluno.update({
      where: { id },
      data: { senha: senhaHash },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });

    return student;
  }
}

export { ChangePasswordStudentService };
