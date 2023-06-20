const twilio = require('twilio')
const { TWILIO_ACOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SMS_NUMBER } = require('../ultis/sms.utils')

class SmsAdapter {

    async send(usuario) {

        const client = twilio(TWILIO_ACOUNT_SID, TWILIO_AUTH_TOKEN)

        await client.messages.create({
          body: `Hola ${usuario.first_name}, gracias por registrarte!`,
          from: TWILIO_SMS_NUMBER,
          to: usuario.phone
        })
    }

}

module.exports = SmsAdapter