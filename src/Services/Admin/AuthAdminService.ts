 import prismaClient from "../../Prisma";
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import 'dotenv/config'

interface AuthRequest {
    email: string,
    senha: string
}

export class AuthAdminService {
    async execute({ email, senha }: AuthRequest) {
        const admin = await prismaClient.admin.findFirst({
            where: {
                email: email
            }
        })

        if (!admin) {
            throw new Error("Usuario ou senha incorretos")
        }

        const senhaMatch = await compare(senha, admin.senha);

        if (!senhaMatch) {
            throw new Error("Email ou senha incorretos!");
        }

        const token = sign(
            {
                nome: admin.nome,
                email: admin.email,
                role: 'admin'
            },
            process.env.JWT_SECRET as string,
            {
                subject: admin.id,
                expiresIn: '30d'
            }
        )
        return {
            id: admin.id,
            nome: admin.nome,
            email: admin.email,
            token: token
        }

    }
}