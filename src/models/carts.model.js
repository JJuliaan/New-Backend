const mongoose = require('mongoose')
const Products = require('./products.model')
const UserDB = require('./usersDB.model')

const cartsCollection = 'cart'

const cartsSchema = new mongoose.Schema({
    cart: [{
        products: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Products
        },
        quantity: {
            type: Number,
            default: 1
        },
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserDB'
    },
})

const Carts = mongoose.model(cartsCollection, cartsSchema)

module.exports = Carts