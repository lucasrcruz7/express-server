// src/controllers/user/DeleteUserController.ts
import { Request, Response } from "express";
import { DeleteStudentService } from "../../Services/Student/DeleteStudentService"

class DeleteStudentController {
  async handle(req: Request, res: Response) {
    const { id } = req.params; // pegando o id da URL

    const deleteStudentService = new DeleteStudentService();

    const student = await deleteStudentService.execute({ id });

    return res.json(student);
  }
}

export { DeleteStudentController };
