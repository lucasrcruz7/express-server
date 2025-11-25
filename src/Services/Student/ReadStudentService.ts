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
        ativo: true,
        presencas: {
          select: {
            presente: true
          }
        }
      },
      orderBy: {
        nome: "asc",
      },
    });

    return students.map(student => {
      const totalPresencas = student.presencas.length;
      const presentes = student.presencas.filter(p => p.presente).length;
      const porcentagemPresenca = totalPresencas > 0 ? (presentes / totalPresencas) * 100 : 0;

      return {
        id: student.id,
        nome: student.nome,
        curso: student.curso,
        serie: student.serie,
        turma: student.turma,
        rm: student.rm,
        ativo: student.ativo,
        porcentagemPresenca: Number(porcentagemPresenca.toFixed(2))
      };
    });
  } 
}
