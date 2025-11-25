import { Request, Response } from "express";
import { ChangePasswordStudentService } from "../../Services/Student/ChangePasswordStudentService";

class ChangePasswordStudentController {
  async handle(req: any, res: Response) {
    const id = req.user.sub;
    const { senhaAtual, novaSenha } = req.body;

    const changePasswordService = new ChangePasswordStudentService();

    const student = await changePasswordService.execute({
      id,
      senhaAtual,
      novaSenha,
    });

    return res.json(student);
  }
}

export { ChangePasswordStudentController };
