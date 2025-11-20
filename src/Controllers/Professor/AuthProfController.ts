import type { Request, Response } from "express";

import { AuthProfService } from "../../Services/Professor/AuthProfService";

export class AuthProfController{
    async handle(req: Request, res: Response, ){
        const {email,senha} = req.body

        if(!email || !senha){
            return res.status(400).json({error: "Email e senha são obrigatórios"})
        }

        try{
            const authProfService = new AuthProfService

            const auth = await authProfService.execute({
                email,
                senha
            })

            return res.json(auth)
        }catch(err: any){
            return res.status(400).json({error: err.message})
        }
    }
}