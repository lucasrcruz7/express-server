import prisma from '../../Prisma'
import { randomUUID } from 'crypto'
import QRCode from 'qrcode'
import { EmailService } from '../Email/EmailService'

export class CreateQrcodeService {
  async execute(alunoId: string) {
    // Verifica se o aluno está ativo
    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId },
      select: { ativo: true }
    })
    
    if (!aluno || !aluno.ativo) {
      throw new Error('Aluno desativado não pode gerar QR code.')
    }

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
      if(!presencaHoje.token) {
        token = randomUUID()

        await prisma.presenca.update({
          where: {
            id: presencaHoje.id, 
          },
          data: {
            token,
          },
        });
      } else {
        token = presencaHoje.token
      }
    } else {
      throw new Error('Professor nao iniciou a chamada!')
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

    const student = await prisma.aluno.findFirst({ where: { id: presenca.alunoId } })
    
    if (student?.responsavelEmail) {
      await EmailService.enviarNotificacaoPresenca(
        student.responsavelEmail,
        student.nome,
        true,
        presenca.data
      )
    }
    
    return { student }
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
    const student = await prisma.aluno.findFirst({ where: { id: alunoId } })
    const baseWherePresencas = {
      serie: student?.serie,
      curso: student?.curso,
      alunoId: alunoId
    }
    // considera o total de datas de presença já registradas no banco
    const totalAulas = await prisma.presenca.count({
      where: baseWherePresencas
    })
    const totalPresencas = await prisma.presenca.count({
      where: {
        ...baseWherePresencas,
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
  static async registroPresencaManual(alunoId: string, data: string, presente: boolean, turma: string, serie: string, curso: string) {
    const day = new Date(data)
    day.setHours(0, 0, 0, 0)
    // Tenta atualizar, senão cria
    let presenca = await prisma.presenca.findFirst({ where: { alunoId, data: day, curso, serie, turma} })
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
          turma,
          serie,
          curso,
          token: '', // token vazio se manual
        }
      })
    }
    
    const aluno = await prisma.aluno.findUnique({ where: { id: alunoId } })
    if (aluno?.responsavelEmail) {
        EmailService.enviarNotificacaoPresenca(
        aluno.responsavelEmail,
        aluno.nome,
        presente,
        day
      )
    }
    
    return presenca
  }

  // Iniciar nova chamada
  static async iniciarChamada(curso: string, serie: string, turma: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Busca todos os alunos ativos da turma
    const alunos = await prisma.aluno.findMany({
      where: { curso, serie, turma, ativo: true }
    })
    
    if (alunos.length === 0) {
      throw new Error('Nenhum aluno ativo encontrado para esta turma!')
    }
    
    // Busca presença de cada aluno
    const presencas = await prisma.presenca.findMany({
      where: { data: today, curso, serie, turma }
    })

    const alunosSemPresenca: string[] = []

    const alunosComPresenca = alunos.map(aluno => {
      const presenca = presencas.find(p => p.alunoId === aluno.id)
      if (!presenca) {
        alunosSemPresenca.push(aluno.id)
      }
      return {
        ...aluno,
        presente: presenca?.presente || false
      }
    })
    
    if(alunosSemPresenca.length > 0){
       await prisma.presenca.createMany({
        data: alunosSemPresenca.map(alunoId => ({
          alunoId: alunoId,
          data: today,
          presente: false,
          curso,
          serie,
          turma,
          token: ''
        }))
      })
    }
    
    
    return { alunos: alunosComPresenca }
  }

  // Encerrar chamada
  static async encerrarChamada(curso: string, serie: string, turma: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const result = await prisma.presenca.updateMany({
      where: { data: today, curso, serie, turma, presente: false },
      data: { presente: false }
    })
    
    return { totalFaltas: result.count }
  }

  // Listagem geral
  static async listaAlunosPresencas(faltaPermitidaPercentual = 25) {
    const alunos = await prisma.aluno.findMany({ 
      select: {
         id: true,
         nome: true,
         rm: true, 
         curso: true, 
         serie: true, 
         turma: true
        }
     })

    const results = []
    for (const aluno of alunos) {
      const relatorio = await this.relatorioPresencaAluno(aluno.id, faltaPermitidaPercentual)
      results.push({
        id: aluno.id,
        nome: aluno.nome,
        rm: aluno.rm,
        curso: aluno.curso,
        serie: aluno.serie,
        turma: aluno.turma,
    
        relatorio: relatorio.presencas
      })
    }
    return results
  }
}
