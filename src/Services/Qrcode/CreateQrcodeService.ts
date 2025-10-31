import prisma from '../../Prisma'
import { randomUUID } from 'crypto'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'; // ajustar se necessário

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
    const verifyUrl = `${BASE_URL}/qrcode/verify/${token}`
    return { token, verifyUrl }
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

  // Chamada em lote: registra presentes pelos tokens e faltas para quem não está na lista
  static async chamadaPresencaPorTokens(tokens: string[]) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    // Marca presentes para tokens válidos
    await prisma.presenca.updateMany({
      where: {
        data: today,
        token: { in: tokens }
      },
      data: {
        presente: true
      }
    })
    // Marca faltas para todos cujas presenças para hoje NÃO estão em tokens e ainda estão como presente=false
    // Garante que o campo já seja false caso o registro exista, serve para gerar relatório corretamente
    await prisma.presenca.updateMany({
      where: {
        data: today,
        token: { notIn: tokens },
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
}
