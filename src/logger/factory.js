const { enviroment } = require("../config/app.config");
const logger = require('../logger/factory')

switch (enviroment) {
    case 'beta':
        console.log('beta')
        module.exports = require('../logger/dev.logger')
    break

    case 'production':
        console.log('prod')
        module.exports = require('../logger/prod.logger')
    break
}