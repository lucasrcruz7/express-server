import type { Request, Response } from "express";

import { ListProfService } from "../../Services/Professor/ListProfService";

export class ListProfController {
    async handle(req: Request, res: Response) {
        try {
            const { nome } = req.query;
            const listProfService = new ListProfService();

            const professores = await listProfService.execute({ 
                nome: nome as string 
            });

            return res.json(professores);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }
}
