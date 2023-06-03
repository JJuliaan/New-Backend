const Cart = require('../models/carts.model')

const find = async () => {
    return await Cart.find().populate('cart.products')
}

const findPopulateId = async (id) => {
    return await Cart.findById(id).populate('cart.products')
}

const findOne = async (cartId) => {
    return await Cart.findOne({_id: cartId})
}

const findById = async (cartId) => {
    return await Cart.findById(cartId)
}

const create = async () => {
    return await Cart.create({})
}

const update = async (idCart, update) => {
    return await Cart.updateOne({ _id: id }, update)
}

const borrar = async () => {
    return await Cart.deleteMany()
}






module.exports = {
    find,
    findOne,
    findById,
    findPopulateId,
    create,
    update,
    borrar
}