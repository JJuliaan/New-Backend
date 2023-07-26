const { GMAIL_APPLICATION } = require('../config/mail.config')
const transport = require('../ultis/mail.utils')

class MailAdapter {
  async send(usuario) {

    await transport.sendMail({
      from: GMAIL_APPLICATION,
      to: usuario.email,
      subject: `Hola ${usuario.first_name}`,
      html:
        ` 
              <div>
                Bienvenido a la Plataforma
              </div>
            `,
    })
  }

  async sendRecoveryEmail(usuario, enlaceRecuperacion) {
    try {
      await transport.sendMail({
        from: GMAIL_APPLICATION,
        to: usuario.email,
        subject: 'Recuperación de Contraseña',
        html: `
            <div>
              <p>Hola ${usuario.first_name},</p>
              <p>Has solicitado restablecer tu contraseña.</p>
              <p>Por favor, haz clic en el siguiente enlace para restablecer tu contraseña:</p>
              <a href="${enlaceRecuperacion}">${enlaceRecuperacion}</a>
            </div>
          `,
      });
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = MailAdapter