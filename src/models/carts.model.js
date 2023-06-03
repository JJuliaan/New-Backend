const mongoose = require('mongoose')
const Product = require('./products.model')

const cartsCollection = 'cart'

const cartsSchema = new mongoose.Schema({
    cart: [{
        products: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Product
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
})

const Carts = mongoose.model(cartsCollection, cartsSchema)

module.exports = Carts