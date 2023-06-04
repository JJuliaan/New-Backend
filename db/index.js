const mongoose = require('mongoose')
const { dbAdmin, dbPassword, dbHost, dbName } = require('../src/config/db.config')

class MongoConnect  {
    static #instance

    constructor () {
        this.MongoConnect()
    }

    async MongoConnect() {
        try {
            await mongoose.connect(`mongodb+srv://${dbAdmin}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`)
            console.log('db is connect')
            
        } catch (error) {
            console.log(error)
        }
    }
    static getInstance() {
        if(!this.#instance) {
            this.#instance = new MongoConnect()
            console.log('origin')
            return this.#instance
        }
        console.log('copia')
        return this.#instance
    }
}

module.exports = MongoConnect