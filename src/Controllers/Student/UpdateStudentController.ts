// src/controllers/user/UpdateStudentController.ts
import { Request, Response } from "express";
import { UpdateStudentService } from "../../Services/Student/UpdateStudentService";

class UpdateStudentController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, curso, serie } = req.body;

    const updateStudentService = new UpdateStudentService();

    const student = await updateStudentService.execute({
      id,
      nome,
      curso,
      serie,
    });

    return res.json(student);
  }
}

export { UpdateStudentController };
