import type { Request, Response } from 'express'
import { CreateQrcodeService } from '../../Services/Qrcode/CreateQrcodeService'

export class CreateQrcodeController {
  async handle(req: Request, res: Response) {
    const user = (req as any).user // permite acesso ao user setado pelo middleware
    if (!user || user.role !== 'aluno') {
      return res.status(401).json({ error: 'Somente alunos podem gerar QRCode.' })
    }
    const createQrcodeService = new CreateQrcodeService()
    const { token } = await createQrcodeService.execute(user.sub)
    return res.json({ token })
  }

  // Remover handleVerifyPresenca (desnecessário)

  // Nova: adicionar/editar presença manual
  async handlePresencaManual(req: Request, res: Response) {
    const user = (req as any).user
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ error: 'Apenas admin pode registrar manualmente.' })
    }
    try {
      const { alunoId, data, presente } = req.body
      if (!alunoId || data === undefined || presente === undefined) {
        return res.status(400).json({ error: 'Envie alunoId, data (yyyy-mm-dd) e presente (boolean).' })
      }
      const result = await CreateQrcodeService.registroPresencaManual(alunoId, data, presente)
      return res.json(result)
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }

  async handleRelatorioPresenca(req: Request, res: Response) {
    const user = (req as any).user
    if (!user || user.role !== 'aluno') {
      return res.status(401).json({ error: 'Somente alunos podem consultar seu relatório.' })
    }
    try {
      const relatorio = await CreateQrcodeService.relatorioPresencaAluno(user.sub)
      return res.json(relatorio)
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }

  // Nova: chamada da presença em lote
  async handleChamadaDaPresenca(req: Request, res: Response) {
    const user = (req as any).user
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ error: 'Apenas admin pode registrar chamadas.' })
    }
    try {
      const { tokens } = req.body // tokens: string[]
      if (!Array.isArray(tokens) || tokens.length === 0) {
        return res.status(400).json({ error: 'Envie um array de tokens.' })
      }
      const result = await CreateQrcodeService.chamadaPresencaPorTokens(tokens)
      return res.json(result)
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }
}
