import { Request, Response } from "express";
import { ReadStudentService } from "../../Services/Student/ReadStudentService";

export class ReadStudentController {

    async handle(req: Request, res: Response): Promise<void> {
        
        try {
            const readStudentService = new ReadStudentService();

            const students = await readStudentService.execute();

            res.json(students);
        }

        catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
}

