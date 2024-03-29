const mongoose = require('mongoose')
const Cart = require('./carts.model')

const collectionName = 'userDB'

const collectionSchema = new mongoose.Schema({
    first_name: {
        require: true,
        type: String
    },
    last_name: {
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
    phone: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'premium'],
        default: 'user',
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    documents: [{
        name: String,
        reference: String
    }],
    last_connection: {
        type: Date,
        default: null
    }
})

const Users = mongoose.model(collectionName, collectionSchema)

module.exports = Users