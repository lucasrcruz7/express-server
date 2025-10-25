import prismaClient from "../../Prisma";

export class ReadStudentService {
  async execute() {
    const students = await prismaClient.aluno.findMany({
      select: {
        nome: true,
        curso: true,
        serie: true,
        rm: true,
      },
      orderBy: {
        nome: "asc", // opcional: ordena pelo nome
      },
    });

    return students;
  } 
}
