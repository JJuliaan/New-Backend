const { Router } = require('express')
const router = Router()
const logger = require('../logger/factory')

router.get('/', async (res, req) => {
    logger.debug('Hola')
    logger.http('Como')
    logger.info('Estas')
    logger.warn('Vos (archvio.log)')
    logger.error('? (archivo.logs)')
    logger.fatal('. (archivo.log)')
})


module.exports = router