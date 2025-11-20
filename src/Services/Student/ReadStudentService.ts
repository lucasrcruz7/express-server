import prismaClient from "../../Prisma";

interface ReadStudentParams {
  curso?: string;
  serie?: string;
  turma?: string;
  ativo?: boolean;
}

export class ReadStudentService {
  async execute({ curso, serie, turma, ativo }: ReadStudentParams = {}) {
    const students = await prismaClient.aluno.findMany({
      where: {
        ...(curso && { curso }),
        ...(serie && { serie }),
        ...(turma && { turma }),
        ...(ativo !== undefined && { ativo }),
      },
      select: {
        id: true,
        nome: true,
        curso: true,
        serie: true,
        turma: true,
        rm: true,
        ativo: true
      },
      orderBy: {
        nome: "asc",
      },
    });

    return students;
  } 
}
