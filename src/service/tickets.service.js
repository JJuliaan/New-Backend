const Ticket = require('../models/ticket.models')
const User = require('../models/usersDB.model')
const generateUniqueCode = require('../ultis/generateUniqueCode.utils')
const calculateTotalAmount = require('../ultis/calculateTotalAmount.utils')
const CartsDao = require('./cart.service');
const Carts = new CartsDao()


class ticketDao {
    constructor() { }


    async create(cartId) {
        try {

            const cart = await Carts.findById(cartId)

            if (!cart) {
                throw 'Carrito no encontrado'
            }

            const user = await User.findById(cart.userId)

            if (!user) {
                throw new Error ('Usuario asociado al carrito no encontrado')
            }

            const purchaserEmail = user.email

            const productsToUpdate = []
            const productsNotPurchased = []


            for (const item of cart.cart) {
                const products = item.products
                const quantityInCart = item.quantity

                if (products.stock >= quantityInCart) {
                    const updatedStock = products.stock - quantityInCart
                    productsToUpdate.push({ products: products._id, stock: updatedStock })
                } else {
                    productsNotPurchased.push(products._id)
                }
            }

            for (const update of productsToUpdate) {
                await Product.findByIdAndUpdate(update.products, { stock: update.stock })
            }

            const newTicketInfo = {
                code: generateUniqueCode(),
                pucharse_datetime: new Date(),
                amount: calculateTotalAmount(cart.cart),
                purcharser: purchaserEmail
            }

            const ticket = await Ticket.create(newTicketInfo)

            cart.cart = cart.cart.filter(item => !productsNotPurchased.includes(item.products))

            await cart.save()

            if (productsNotPurchased.length > 0) {
                throw new Error(`Compra finalizada con productos no procesados: ${productsNotPurchased}`)
            } else {
                return { message: 'Compra finalizada exitosamente', ticket }
            }
        } catch (error) {
            console.error('Error al finalizar la compra:', error)
            throw new Error ('Ha ocurrido un error al finalizar la compra')
        }

    }
}

module.exports = ticketDao