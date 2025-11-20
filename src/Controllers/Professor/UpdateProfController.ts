import { Request, Response } from "express";
import { UpdateProfService } from "../../Services/Professor/UpdateProfService";

class UpdateProfController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    const updateProfService = new UpdateProfService();

    const professor = await updateProfService.execute({
      id,
      nome,
      email,
      senha
    });

    return res.json(professor);
  }
}

export { UpdateProfController };
