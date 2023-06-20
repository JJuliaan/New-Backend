
const { GMAIL_APLICATION } = require('../config/mail.config')
const transport = require('../ultis/mail.utils')

class MailAdapter {
    async send(usuario){
        
        await transport.sendMail({
            from: GMAIL_APLICATION,
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
}

module.exports = MailAdapter