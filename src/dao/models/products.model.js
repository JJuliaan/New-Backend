const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const productsCollection = 'product'

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    description: String,
    thumbnail: {
        type: String,
        require: true
    },
    code: {
        type: String,   
        require: true,
        unique: true
    },
    stock: {
        type: Number,
        require: true
    },
    status: {
        type: Boolean,
        default: true,
    },
    category: {
        type: String,
        require: true
    },
})
productsSchema.plugin(mongoosePaginate)

const Products = mongoose.model(productsCollection, productsSchema)

module.exports = Products