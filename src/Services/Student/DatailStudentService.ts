import prismaClient from "../../Prisma";

interface DetailStudentRequest{
    id: string;
}

export class DetailStudentService{
    async execute({id}: DetailStudentRequest){
        const student = await prismaClient.aluno.findFirst({
            where:{
                id: id
            },

            select:{
                id: true,
                nome: true,
                email: true
            }

        })
        
        return student
    }
}