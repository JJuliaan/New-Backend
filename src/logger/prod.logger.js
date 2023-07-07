const winston = require('winston')
const coustomLevelOptions = require('../ultis/loggerCoustomLevelOptions.utils')

const logger = winston.createLogger({
    level: coustomLevelOptions.level,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: coustomLevelOptions.colors}),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({
            filename: './logs/warnings.log',
            level: 'warn',
            format: winston.format.simple(),

        }),
        new winston.transports.File({
            filename: './logs/errors.log',
            level: 'error',
            format: winston.format.simple(),

        }),
        new winston.transports.File({
            filename: './logs/fatal.log',
            level: 'fatal',
            format: winston.format.simple(),

        })
    ]
})

module.exports = logger