// src/controllers/user/UpdateUserController.ts
import { Request, Response } from "express";
import { UpdateUserService } from "../../Services/Student/UpdateStudentService";

class UpdateUserController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, curso, serie } = req.body;

    const updateUserService = new UpdateUserService();

    const student = await updateUserService.execute({
      id,
      nome,
      curso,
      serie,
    });

    return res.json(student);
  }
}

export { UpdateUserController };
