const { enviroment } = require("../config/app.config");

switch (enviroment) {
    case 'beta':
        module.exports = require('../adapters/mail.adapter')
    break

    case 'production':
        module.exports = require('../adapters/sms.adapter')
    break
}