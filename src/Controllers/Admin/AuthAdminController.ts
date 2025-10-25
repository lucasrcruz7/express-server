import type { Request, Response } from "express";
import {AuthAdminService} from '../../Services/Admin/AuthAdminService'

export class AuthAdminController{
    async handle(req: Request, res: Response){
        const {email,senha} = req.body

        const authAdminService = new AuthAdminService

        const auth = await authAdminService.execute({
            email,
            senha
        })

        return res.json(auth)
    }
}
