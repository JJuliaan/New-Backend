const { default: mongoose } = require('mongoose')
const Carts = require('./models/carts.model')
const Products = require('./models/products.model')

class CartsDao {
    constructor() { }

    async findAll() {
        return await Carts.find().populate('cart.products')
    }

    async agregateProduct(cid, pid) {
        try {
            const buscadorCart = await Carts.findOne({ _id: cid })
            const buscadorProduct = await Products.findOne({ _id: pid })
            if (!buscadorProduct) return 'Producto no encontado'

            const buscadorIndex = buscadorCart.cart.findIndex(p => p.products._id.toString() === pid)

            if (buscadorIndex !== -1) {
                console.log(buscadorIndex)
                buscadorCart.cart[buscadorIndex].quantity += 1
            } else {
                buscadorCart.cart.push({
                    products: pid,
                })
            }

            await buscadorCart.save()

            return buscadorCart
        } catch (error) {
            return error.message
        }
    }

    async actualizarCantidad(cid, pid, cantidad) {
        try {
            // console.log('entro');
            const buscadorCart = await Carts.findById({ _id: cid })
            const buscadorProduct = buscadorCart.cart.find(p => p.products == pid)

            // console.log(buscadorProduct)

            if (!buscadorProduct) return 'El Producto no existe'

            buscadorProduct.quantity = cantidad
            await buscadorCart.save()

            return buscadorCart

        } catch (error) {
            return error
        }
    }

    async borrarProduct(cid) {
        try {
            const buscadorCart = await Carts.findOne({ _id: cid })
            buscadorCart.cart = []

            await buscadorCart.save()

            return buscadorCart

        } catch (error) {
            return error
        }
    }

    async borrarOne(cid, pid) {
        try {
            console.log('entro');
            const buscadorCart = await Carts.findOne({ _id: cid })
            const buscadorProduct = buscadorCart.cart.findIndex(p => p.products.equals(new mongoose.Types.ObjectId(pid)))

            if (buscadorProduct === -1) return 'Producto no encontrado'

            buscadorCart.cart.splice(buscadorProduct, 1)

            await buscadorCart.save()
            return buscadorCart

        } catch (error) {

        }
    }

    async findById(id) {
        return await Carts.findById(id).populate('cart.products')
    }

    async create() {
        return await Carts.create({})
    }

    async updateOne(id, update) {
        return await Carts.updateOne({ _id: id }, update)
    }

    async delete() {
        return await Carts.deleteMany()
    }
}


module.exports = CartsDao