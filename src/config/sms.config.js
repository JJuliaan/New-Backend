require('dotenv').config()

module.exports = {
    TWILIO_ACOUNT_SID: process.env.TWILIO_ACOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_SMS_NUMBER: process.env.TWILIO_SMS_NUMBER
}