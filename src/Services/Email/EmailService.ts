import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.SENHA_EMAIL_USER,
  },
})

export class EmailService {
  static async enviarNotificacaoPresenca(
    responsavelEmail: string,
    nomeAluno: string,
    presente: boolean,
    data: Date
  ) {
    const status = presente ? 'PRESENTE' : 'AUSENTE'
    const dataFormatada = data.toLocaleDateString('pt-BR')
    const statusColor = presente ? '#28a745' : '#dc3545'

    await transporter.sendMail({
      from: `"Sistema de Presença" <${process.env.EMAIL_USER}>`,
      to: responsavelEmail,
      subject: `Notificação de Presença - ${nomeAluno}`,
      text: `Prezado(a) Responsável,\n\nInformamos que o aluno ${nomeAluno} foi registrado como ${status} na data de ${dataFormatada}.\n\nEsta é uma mensagem automática do Sistema de Controle de Presença.\n\nAtenciosamente,\nEquipe Acadêmica`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333333; margin-top: 0;">Notificação de Presença</h2>
            <p style="color: #666666; font-size: 16px; line-height: 1.6;">Prezado(a) Responsável,</p>
            <p style="color: #666666; font-size: 16px; line-height: 1.6;">
              Informamos que o aluno <strong>${nomeAluno}</strong> foi registrado como:
            </p>
            <div style="border: 2px solid ${statusColor}; color: ${statusColor}; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
              <strong style="font-size: 18px;">${status}</strong>
            </div>
            <p style="color: #666666; font-size: 16px; line-height: 1.6;">
              <strong>Data:</strong> ${dataFormatada}
            </p>
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 25px 0;">
            <p style="color: #999999; font-size: 14px; line-height: 1.6;">
              Esta é uma mensagem automática do Sistema de Controle de Presença.<br>
              Por favor, não responda este e-mail.
            </p>
            <p style="color: #666666; font-size: 14px; margin-top: 20px;">
              Atenciosamente,<br>
              <strong>Simpe</strong>
            </p>
          </div>
        </div>
      `,
    })
  }
}
