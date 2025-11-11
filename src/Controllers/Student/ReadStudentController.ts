import { Request, Response } from "express";
import { ReadStudentService } from "../../Services/Student/ReadStudentService";

export class ReadStudentController {

    async handle(req: Request, res: Response): Promise<void> {
        
        try {
            const { curso, serie } = req.query;
            
            const readStudentService = new ReadStudentService();

            const students = await readStudentService.execute({
                curso: curso as string,
                serie: serie as string,
            });

            res.json(students);
        }

        catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
}

