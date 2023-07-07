const winston = require('winston')

const logger = winston.createLogger({
    level: CoustomLevelOptions.level,
    transports: [
        new winston.transports.Console({ level: 'http' }),
        new winston.transports.File({ filename: 'error.log', level: 'warning'})
    ]
})

const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.http(
        `${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
    )

    next()
}

module.exports = addLogger