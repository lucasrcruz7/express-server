import type { Request, Response } from "express";

export class AuthController{
    async handle(req: any, res: Response){
        return res.json(req.user)
    }
}