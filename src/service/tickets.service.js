const Ticket = require('../models/ticket.models');
const User = require('../models/usersDB.model');
const generateUniqueCode = require('../ultis/generateUniqueCode.utils');
const calculateTotalAmount = require('../ultis/calculateTotalAmount.utils');
const CartsDao = require('./cart.service');
const Products = require('../models/products.model');
const Carts = new CartsDao();

class TicketDao {
    constructor() { }

    async create(cartId) {
        try {
            const cart = await Carts.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const user = await User.findById(cart.userId);
            console.log(user)
            if (!user) {
                throw new Error('Usuario asociado al carrito no encontrado');
            }

            const purchaserEmail = user.email;

            const { productsToUpdate, productsNotPurchased } = await this.updateProducts(cart.cart);

            await Promise.all(productsToUpdate.map(update => Products.findByIdAndUpdate(update.products, { stock: update.stock })));

            const newTicketInfo = {
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calculateTotalAmount(cart.cart),
                purchaser: purchaserEmail
            };

            const ticket = await Ticket.create(newTicketInfo);

            cart.cart = cart.cart.filter(item => !productsNotPurchased.includes(item.products));
            await cart.save();

            if (productsNotPurchased.length > 0) {
                throw new Error(`Compra finalizada con productos no procesados: ${productsNotPurchased}`);
            } else {
                return { message: 'Compra finalizada exitosamente', ticket };
            }
        } catch (error) {
            console.error('Error al finalizar la compra:', error);
            throw new Error('Ha ocurrido un error al finalizar la compra');
        }
    }

    async updateProducts(cartItems) {
        const productsToUpdate = [];
        const productsNotPurchased = [];

        for (const item of cartItems) {
            const product = item.products;
            const quantityInCart = item.quantity;

            if (product.stock >= quantityInCart) {
                const updatedStock = product.stock - quantityInCart;
                productsToUpdate.push({ products: product._id, stock: updatedStock });
            } else {
                productsNotPurchased.push(product._id);
            }
        }

        return { productsToUpdate, productsNotPurchased };
    }
}

module.exports = TicketDao;
