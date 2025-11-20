 import prismaClient from "../../Prisma";
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import 'dotenv/config'

interface AuthRequest {
    email: string,
    senha: string
}

export class AuthProfService {
    async execute({ email, senha }: AuthRequest) {
        const professor = await prismaClient.professor.findFirst({
            where: {
                email: email
            }
        })

        if (!professor) {
            throw new Error("Usuario ou senha incorretos")
        }

        const senhaMatch = await compare(senha, professor.senha);

        if (!senhaMatch) {
            throw new Error("Email ou senha incorretos!");
        }

        const token = sign(
            {
                nome: professor.nome,
                email: professor.email,
                role: 'professor'
            },
            process.env.JWT_SECRET as string,
            {
                subject: professor.id,
                expiresIn: '30d'
            }
        )
        return {
            id: professor.id,
            nome: professor.nome,
            email: professor.email,
            token: token
        }

    }
}