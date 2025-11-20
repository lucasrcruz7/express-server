import prismaClient from "../../Prisma";
import { randomUUID } from "crypto"; // para gerar o token
import {hash} from 'bcryptjs'


interface StudentRequest {
  nome: string;
  email: string;
  responsavelEmail: string;
  curso: string;
  serie: string;
  senha: string
  telefone: string
  turma: string
}

export class CreateStudentService {
  async execute({ nome, email, responsavelEmail, curso, serie, senha, telefone, turma}: StudentRequest) {
    if (!email) {
      throw new Error("E-mail nao enviado");
    }

    const StudentAlreadyExistis = await prismaClient.aluno.findFirst({
      where: {
        email: email,
      },
    });

    if (StudentAlreadyExistis) {
      throw new Error("Usuário já cadastrado");
    }

   const rm = Math.floor(10000 + Math.random() * 90000);

   const senhaHash = await hash(senha,8)

    const student = await prismaClient.aluno.create({
      data: {
        nome,
        email,
        responsavelEmail,
        curso,
        serie,
        rm,                 // matrícula obrigatória
        telefone,
        turma,
        senha: senhaHash, // depois você troca para hash de verdade     
      },
      select: {
        id: true,
        nome: true,
        rm: true,  
      },
    });

    return student;
  }
}
