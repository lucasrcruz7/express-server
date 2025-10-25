import type { Request, Response } from "express";
import { CreateStudentService } from '../../Services/Student/CreateStudentService'

export class CreateStudentController{
    async handle(req: Request, res: Response){
       const {nome, email, responsavelEmail, curso, serie, senha} = req.body

       const createStudentService = new CreateStudentService();
       const student = await createStudentService.execute({nome, email, responsavelEmail, curso, serie, senha})

       return res.json(student)
    }
}