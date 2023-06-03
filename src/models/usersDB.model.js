const mongoose = require('mongoose')

const collectionName = 'userDB'

const collectionSchema = new mongoose.Schema({
    first_name: {
        require: true,
        type: String
    },
    last_name: {
        require: true,
        type: String
    },
    email: {
        require: true,
        type: String,
        unique: true
    },
    password: {
        require: true,
        type: String
    },
    role: {
        type: String,
        enum: ['administrador', 'usuario'],
        default: 'usuario',
    },
})

const Users = mongoose.model(collectionName, collectionSchema)

module.exports = Users