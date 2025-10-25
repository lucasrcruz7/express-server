import type { Request, Response } from "express";
import { DetailStudentService } from "../../Services/Student/DatailStudentService";

export class DatailStudentController{
    async handle(req: Request, res: Response){
        const id = req.body

        const datailStudentService = new DetailStudentService
        const student = await datailStudentService.execute(id)

        return res.json(student)
    }
}