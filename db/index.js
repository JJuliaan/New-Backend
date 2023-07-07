const mongoose = require('mongoose')
const { dbAdmin, dbPassword, dbHost, dbName } = require('../src/config/db.config')
const logger = require('../src/logger/factory');

class MongoConnect  {
    static #instance

    constructor () {
        this.MongoConnect()
    }

    async MongoConnect() {
        try {
            await mongoose.connect(`mongodb+srv://${dbAdmin}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`)
            logger.info('db is connect')
            
        } catch (error) {
            logger.error(error.message)
        }
    }
    static getInstance() {
        if(!this.#instance) {
            this.#instance = new MongoConnect()
            logger.debug('origin')
            return this.#instance
        }
        logger.debug('copia')
        return this.#instance
    }
}

module.exports = MongoConnect