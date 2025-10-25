import prismaClient from "../../Prisma";
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import 'dotenv/config'

interface AuthRequest {
    rm: number,
    senha: string
}

export class AuthStudentService {
    async execute({ rm, senha }: AuthRequest) {
        const student = await prismaClient.aluno.findFirst({
            where: {
                rm: rm
            }
        })

        if (!student) {
            throw new Error("RM ou senha incorretos")
        }

        const senhaMatch = await compare(senha, student.senha);

        if (!senhaMatch) {
            throw new Error("RM ou senha incorretos!");
        }

        const token = sign(
            {
                nome: student.nome,
                rm: student.rm,
                role: 'aluno'
            },
            process.env.JWT_SECRET as string,
            {
                subject: student.id,
                expiresIn: '30d'
            }
        )
        return {
            id: student.id,
            nome: student.nome,
            rm: student.rm,
            token: token
        }

    }
}