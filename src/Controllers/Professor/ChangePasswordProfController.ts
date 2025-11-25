import { Request, Response } from "express";
import { ChangePasswordProfService } from "../../Services/Professor/ChangePasswordProfService";

class ChangePasswordProfController {
  async handle(req: any, res: Response) {
    const id = req.user.sub;
    const { senhaAtual, novaSenha } = req.body;

    const changePasswordService = new ChangePasswordProfService();

    const professor = await changePasswordService.execute({
      id,
      senhaAtual,
      novaSenha,
    });

    return res.json(professor);
  }
}

export { ChangePasswordProfController };
