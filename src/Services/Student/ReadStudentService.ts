import prismaClient from "../../Prisma";

interface ReadStudentParams {
  curso?: string;
  serie?: string;
}

export class ReadStudentService {
  async execute({ curso, serie }: ReadStudentParams = {}) {
    const students = await prismaClient.aluno.findMany({
      where: {
        ...(curso && { curso }),
        ...(serie && { serie }),
      },
      select: {
        id: true,
        nome: true,
        curso: true,
        serie: true,
        rm: true,
      },
      orderBy: {
        nome: "asc",
      },
    });

    return students;
  } 
}
