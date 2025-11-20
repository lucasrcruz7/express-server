import prismaClient from "../../Prisma";

interface ListProfRequest {
    nome?: string;
}

export class ListProfService {
    async execute({ nome }: ListProfRequest) {
        const professores = await prismaClient.professor.findMany({
            where: nome ? {
                nome: {
                    contains: nome,
                    mode: 'insensitive'
                }
            } : {},
            select: {
                id: true,
                nome: true,
                email: true
            }
        });

        return professores;
    }
}
