const mongoose = require('mongoose')

const messagesCollection = 'message'

const messagesSchema = new mongoose.Schema({
    user: String,
    message: String
})

const Messages = mongoose.model(messagesCollection, messagesSchema)

module.exports = Messages