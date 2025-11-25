import type { Request, Response } from "express";
import {AuthStudentService} from '../../Services/Student/AuthStudentService'

export class AuthStudentController{
    async handle(req: Request, res: Response){
        const {rm, senha} = req.body

        const authStudentService = new AuthStudentService

        const auth = await authStudentService.execute({
            rm,
            senha
        })

        return res.json(auth)
    }
}


