const CartModel = require('../models/carts.model')

class Cart {
    constructor (userId) {
        this.userId = userId
    }

    async save () {
        return await CartModel.create({ userId: this.userId })
    } 
}

const find = async () => {
    return await CartModel.find().populate('cart.products')
}

const findPopulateId = async (id) => {
    return await CartModel.findById(id).populate('cart.products')
}

const findOne = async (cartId) => {
    return await CartModel.findById({_id: cartId})
}

const findById = async (cartId) => {
    return await CartModel.findById(cartId)
}

const create = async () => {
    return await CartModel.create({})
}

const update = async (idCart, update) => {
    return await CartModel.updateOne({ _id: id }, update)
}

const borrar = async () => {
    return await CartModel.deleteMany()
}






module.exports = {
    find,
    findOne,
    findById,
    findPopulateId,
    create,
    update,
    borrar,
    Cart
}