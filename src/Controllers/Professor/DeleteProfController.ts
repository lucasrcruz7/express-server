import { Request, Response } from "express";
import { DeleteProfService } from "../../Services/Professor/DeleteProfService";

class DeleteProfController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const deleteProfService = new DeleteProfService();

    const professor = await deleteProfService.execute({ id });

    return res.json(professor);
  }
}

export { DeleteProfController };
