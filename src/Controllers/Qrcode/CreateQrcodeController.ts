import type { Request, Response } from 'express'
import { CreateQrcodeService } from '../../Services/Qrcode/CreateQrcodeService'

export class CreateQrcodeController {
  async handle(req: Request, res: Response) {
    const user = (req as any).user // permite acesso ao user setado pelo middleware
    if (!user || user.role !== 'aluno') {
      return res.status(401).json({ error: 'Somente alunos podem gerar QRCode.' })
    }
    const createQrcodeService = new CreateQrcodeService()
    const { qrcode } = await createQrcodeService.execute(user.sub)
    return res.json({ qrcode })
  }

  async handleRegistrarPresencaPorToken(req: Request, res: Response) {
    const user = (req as any).user

    if (!user || user.role !== 'professor') {
      return res.status(401).json({ error: 'Apenas professor pode registrar presença por token.' })
    }

    const { token } = req.body

    if (!token) {
      return res.status(400).json({ error: 'Token é obrigatório.' })
    }
    
    const result = await CreateQrcodeService.registrarPresencaPorToken(token)
    return res.json(result)

  }

  // Nova: adicionar/editar presença manual
  async handlePresencaManual(req: Request, res: Response) {
    const user = (req as any).user

    if (!user || user.role !== 'professor') {
      return res.status(401).json({ error: 'Apenas professor pode registrar manualmente.' })
    }

    const { alunoId, data, presente, curso, serie, turma } = req.body

    if (!alunoId || data === undefined || presente === undefined) {
      return res.status(400).json({ error: 'Envie alunoId, data (yyyy-mm-dd) e presente (boolean).' })
    }

    const result = await CreateQrcodeService.registroPresencaManual(alunoId, data, presente, curso, turma, serie)
    return res.json(result)
  }

  async handleRelatorioPresenca(req: Request, res: Response) {
    const user = (req as any).user

    if (!user || user.role !== 'aluno') {
      return res.status(401).json({ error: 'Somente alunos podem consultar seu relatório.' })
    }
    const relatorio = await CreateQrcodeService.relatorioPresencaAluno(user.sub)

    return res.json(relatorio)
  }

  // Nova: chamada da presença
  async handleChamadaDaPresenca(req: Request, res: Response) {
    const user = (req as any).user

    if (!user || user.role !== 'professor') {
      return res.status(401).json({ error: 'Apenas professor pode registrar chamadas.' })
    }

    const { token } = req.body // token: string

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Envie um token válido (string).' })
    }

    const result = await CreateQrcodeService.chamadaPresencaPorToken(token)
    return res.json(result)
  }

  // Listagem de alunos + presenças
  async handleListagemAlunosPresencas(req: Request, res: Response) {
    const user = (req as any).user
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ error: 'Apenas admin pode listar.' })
    }
    try {
      const alunos = await CreateQrcodeService.listaAlunosPresencas()
      return res.json(alunos)
    } catch (err: any) {
      return res.status(500).json({ error: err.message })
    }
  }

  async handleIniciarChamada(req: Request, res: Response) {
    const user = (req as any).user
    if (!user || user.role !== 'professor') {
      return res.status(401).json({ error: 'Apenas professor pode iniciar chamada.' })
    }
     const { curso, serie, turma } = req.body
      if (!curso || !serie || !turma) {
        return res.status(400).json({ error: 'Curso, série e turma são obrigatórios.' })
      }
      const result = await CreateQrcodeService.iniciarChamada(curso, serie, turma)
      return res.json(result)
  }

  async handleEncerrarChamada(req: Request, res: Response) {
    const user = (req as any).user
    if (!user || user.role !== 'professor') {
      return res.status(401).json({ error: 'Apenas professor pode encerrar chamada.' })
    }
    try {
      const { curso, serie, turma } = req.body
      if (!curso || !serie || !turma) {
        return res.status(400).json({ error: 'Curso, série e turma são obrigatórios.' })
      }
      const result = await CreateQrcodeService.encerrarChamada(curso, serie, turma)
      return res.json(result)
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }
}
