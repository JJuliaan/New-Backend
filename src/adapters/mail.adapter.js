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
      })
    } catch (error) {
      console.error(error)
    }
  }

  async sendNotificationRemove(usuario) {
    try {
      await transport.sendMail({
        from: GMAIL_APPLICATION,
        to: usuario.email,
        subject: 'Eliminacion de usuario',
        html: `
            <div>
              <p>Hola ${usuario.first_name},</p>
              <p>Su usuario ah sido removido por la falta de conexion.</p>
            </div>
          `,
      })
    } catch (error) {
      console.error(error)
    }
  }

  async sendProductDeletedNotification(userEmail, productName) {
    try {
      await transport.sendMail({
        from: GMAIL_APPLICATION,
        to: userEmail.email,
        subject: 'Producto Eliminado',
        html: `
                <div>
                    <p>Hola,</p>
                    <p>El producto "${productName}" que pertenecía a tu cuenta ha sido eliminado.</p>
                    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                </div>
            `,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async sendPurchaseConfirmation(usuario, product, total) {
    try {
      await transport.sendMail({
        from: GMAIL_APPLICATION,
        to: usuario.email,
        subject: 'Confirmación de Compra Exitosa',
        html: `
          <div>
            <p>Hola ${usuario.first_name},</p>
            <p>¡Gracias por tu compra en nuestra tienda!</p>
            <p>Esperamos que disfrutes de tus productos. Si tienes alguna pregunta, no dudes en contactarnos.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error(error);
    }
  }
}



module.exports = MailAdapter