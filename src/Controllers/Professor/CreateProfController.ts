import type { Request, Response } from "express";

import { CreateProfessorService } from "../../Services/Professor/CreateProfService";

export class CreateProfessorController{
    async handle(req: Request, res: Response){
       const {nome, email, senha} = req.body

       const createProfessorService = new CreateProfessorService

       const professor = await createProfessorService.execute({nome, email, senha})

       return res.json(professor)
    }
}