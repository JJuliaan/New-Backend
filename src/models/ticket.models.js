const mongoose = require('mongoose')

const ticketCollection = 'ticket'

const ticketSchema = new mongoose.Schema({
    
    code: {
        type: String,
        require: true,
        unique: true
    },

    pucharse_datetime: {
        type: Date,
        default: Date.now,
        require: true
    },

    amount: {
        type: Number,
        require: true,
    },

    pucharser: {
        type: String,
        require: true
    }
})

const Ticket = mongoose.model(ticketCollection, ticketSchema)

module.exports = Ticket