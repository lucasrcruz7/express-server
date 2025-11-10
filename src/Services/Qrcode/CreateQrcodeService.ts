import prisma from '../../Prisma'
import { randomUUID } from 'crypto'
import QRCode from 'qrcode'

export class CreateQrcodeService {
  async execute(alunoId: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    // Procura se já há token válido para hoje
    const presencaHoje = await prisma.presenca.findFirst({
      where: {
        alunoId,
        data: today,
      },
      select: {
        id: true,
        token: true,
      }
    })
    let token
    if (presencaHoje) {
      token = presencaHoje.token
    } else {
      token = randomUUID()
      await prisma.presenca.create({
        data: {
          alunoId,
          data: today,
          presente: false,
          token,
        }
      })
    }
    // Gerar QRCode do token
    const qrcode = await QRCode.toDataURL(token)
    return { qrcode }
  }

  // Função para o admin validar um token e marcar presença
  static async registrarPresencaPorToken(token: string) {
    // busca registro pelo token (único do dia)
    const presenca = await prisma.presenca.findFirst({ where: { token } })
    if (!presenca) {
      throw new Error('Token inválido!')
    }
    if (presenca.presente) {
      throw new Error('Presença já registrada para este token!')
    }
    // marca presença
    await prisma.presenca.update({
      where: { id: presenca.id },
      data: { presente: true }
    })
    return { message: 'Presença registrada com sucesso!' }
  }

  // Chamada: registra presente para token e faltas para quem não está no token
  static async chamadaPresencaPorToken(token: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    // Marca presente para token válido
    await prisma.presenca.updateMany({
      where: {
        data: today,
        token: token
      },
      data: {
        presente: true
      }
    })
    // Marca faltas para todos cujas presenças para hoje NÃO são deste token e ainda estão como presente=false
    await prisma.presenca.updateMany({
      where: {
        data: today,
        token: { not: token },
        presente: false,
      },
      data: {
        presente: false
      }
    })
    // Opcional: retorno de resultado resumido
    const totalPresentes = await prisma.presenca.count({ where: { data: today, presente: true } })
    const totalFaltas = await prisma.presenca.count({ where: { data: today, presente: false } })
    return { totalPresentes, totalFaltas }
  }

  // Serviço para relatório de presença do aluno
  static async relatorioPresencaAluno(alunoId: string, faltaPermitidaPercentual = 25) {
    // considera o total de datas de presença já registradas no banco
    const totalAulas = await prisma.presenca.count({
      where: {
        alunoId
      }
    })
    const totalPresencas = await prisma.presenca.count({
      where: {
        alunoId,
        presente: true
      }
    })
    const faltas = totalAulas - totalPresencas
    // Exemplo: pode faltar até 25% do total de aulas. 
    const faltasPermitidas = Math.floor((totalAulas * faltaPermitidaPercentual) / 100)
    const frequencia = totalAulas > 0 ? Math.round((totalPresencas / totalAulas) * 100) : 0
    return { totalAulas, presencas: totalPresencas, faltas, frequencia, faltasPermitidas }
  }

  // Adicionar ou alterar manualmente
  static async registroPresencaManual(alunoId: string, data: string, presente: boolean) {
    const day = new Date(data)
    day.setHours(0, 0, 0, 0)
    // Tenta atualizar, senão cria
    let presenca = await prisma.presenca.findFirst({ where: { alunoId, data: day } })
    if (presenca) {
      presenca = await prisma.presenca.update({
        where: { id: presenca.id },
        data: { presente }
      })
    } else {
      presenca = await prisma.presenca.create({
        data: {
          alunoId,
          data: day,
          presente,
          token: '', // token vazio se manual
        }
      })
    }
    return presenca
  }

  // Listagem geral
  static async listaAlunosPresencas(faltaPermitidaPercentual = 25) {
    const alunos = await prisma.aluno.findMany({ select: { id: true, nome: true, rm: true } })
    const results = []
    for (const aluno of alunos) {
      const relatorio = await this.relatorioPresencaAluno(aluno.id, faltaPermitidaPercentual)
      results.push({
        id: aluno.id,
        nome: aluno.nome,
        rm: aluno.rm,
        relatorio: relatorio.presencas
      })
    }
    return results
  }
}
