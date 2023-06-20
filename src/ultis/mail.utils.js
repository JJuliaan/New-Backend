const nodemailer = require('nodemailer')
// const { GMAIL_APLICATION, PASSWORD_APLICATION} = require('../config/mail.config')

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'julyagueroa@gmail.com',                      
        pass: 'rawggipwogedcopp'
    }

})

module.exports = transport