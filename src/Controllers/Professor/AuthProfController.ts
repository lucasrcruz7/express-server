import type { Request, Response } from "express";

import { AuthProfService } from "../../Services/Professor/AuthProfService";

export class AuthProfController{
    async handle(req: Request, res: Response, ){
        const {email,senha} = req.body

        if(!email || !senha){
            throw new Error("Email e senha são obrigatórios")
        }
        
        const authProfService = new AuthProfService

        const auth = await authProfService.execute({
            email,
            senha
        })

        return res.json(auth)
    }
}