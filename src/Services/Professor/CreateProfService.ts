import prismaClient from "../../Prisma";
import { randomUUID } from "crypto"; // para gerar o token
import {hash} from 'bcryptjs'


interface ProfessorRequest {
  nome: string;
  email: string;
  senha: string
}

export class CreateProfessorService {
  async execute({ nome, email, senha}: ProfessorRequest) {
    if (!email) {
      throw new Error("E-mail nao enviado");
    }

    const ProfessorAlreadyExistis = await prismaClient.professor.findFirst({
      where: {
        email: email,
      },
    });

    if (ProfessorAlreadyExistis) {
      throw new Error("Usuário já cadastrado");
    }

   const senhaHash = await hash(senha,8)

    const professor = await prismaClient.professor.create({
      data: {
        nome,
        email,
        senha: senhaHash, // depois você troca para hash de verdade     
      },
      select: {
        id: true,
        nome: true,
      },
    });

    return professor;
  }
}
