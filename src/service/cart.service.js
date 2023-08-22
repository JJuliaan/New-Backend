const mongoose = require('mongoose')
const cartStorage = require('../stores/cart.store')
const Products = require('../models/products.model')
const Cart = require('../models/carts.model')

class CartsDao {
    constructor() { }

    async findAll() {
        return await cartStorage.find()
    }

    async createForUser(userId) {
        try {
            const userCart = await Cart.findOne({ userId: userId });

            const newCart = new Cart({
                userId: userId,
                cart: userCart ? userCart.cart : []
            });

            return await newCart.save();
        } catch (error) {
            throw error;
        }
    }

    async agregateProduct(cid, pid, userId) {
        try {
            console.log(cid)
            const buscadorCart = await Cart.findById(cid);
            const buscadorProduct = await Products.findById(pid);
            console.log(buscadorCart)

            if (!buscadorProduct) {
                return 'Producto no encontrado';
            }

            if (!buscadorCart) {
                console.log('no hay carrito')
            }

            if (userId && buscadorProduct.owner && buscadorProduct.owner.toString() === userId.toString()) {
                return { error: 'No puedes agregar tu propio producto al carrito' };
            }

            const buscadorIndex = buscadorCart.cart.findIndex(p => p.products._id.toString() === pid);

            if (buscadorIndex !== -1) {
                console.log(buscadorIndex);
                buscadorCart.cart[buscadorIndex].quantity += 1;
            } else {
                buscadorCart.cart.push({
                    products: pid,
                });
            }

            await buscadorCart.save();

            return buscadorCart;
        } catch (error) {
            throw error;
        }
    }

    async actualizarCantidad(cid, pid, cantidad) {
        try {
            // console.log('entro');
            const buscadorCart = await cartStorage.findById(cid)
            const buscadorProduct = buscadorCart.cart.find(p => p.products == pid)

            // console.log(buscadorProduct)

            if (!buscadorProduct) return 'El Producto no existe'

            buscadorProduct.quantity = cantidad
            await buscadorCart.save()

            return buscadorCart

        } catch (error) {
            throw error
        }
    }

    async borrarProduct(cid) {
        try {
            const buscadorCart = await cartStorage.findOne(cid)
            buscadorCart.cart = []

            await buscadorCart.save()

            return buscadorCart

        } catch (error) {
            throw error
        }
    }

    async borrarOne(cid, pid) {
        try {
            console.log('entro');
            const buscadorCart = await cartStorage.findOne(cid)
            const buscadorProduct = buscadorCart.cart.findIndex(p => p.products.equals(new mongoose.Types.ObjectId(pid)))

            if (buscadorProduct === -1) return 'Producto no encontrado'

            buscadorCart.cart.splice(buscadorProduct, 1)

            await buscadorCart.save()
            return buscadorCart

        } catch (error) {
            throw error
        }
    }

    async findUserCart(userId) {
        try {
            const userCart = await cartStorage.findOne({ userId: userId }).populate('cart.products');
            return userCart;
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        return await cartStorage.findPopulateId(id)
    }

    async create() {
        return await cartStorage.create()
    }

    async updateOne(id, update) {
        return await cartStorage.update(id, update)
    }

    async delete() {
        return await cartStorage.borrar()
    }
}


module.exports = CartsDao