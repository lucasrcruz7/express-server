// src/controllers/user/DeleteUserController.ts
import { Request, Response } from "express";
import { DeleteUserService } from "../../Services/Student/DeleteStudentService"

class DeleteUserController {
  async handle(req: Request, res: Response) {
    const { id } = req.params; // pegando o id da URL

    const deleteUserService = new DeleteUserService();

    const student = await deleteUserService.execute({ id });

    return res.json(student);
  }
}

export { DeleteUserController };
