const fs = require('fs')

class cartManager {
    constructor(path) {
        this.path = path
        this.id = 1
        this.products = JSON.parse(fs.readFileSync(path, 'utf-8'))
    }

    async construirCart () {
        const idCarrito = this.id++
        const cart = {
            id: idCarrito,
            products: []
        }
        this.products.push(cart)
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'))
        console.log('Carrito creado');
    }

    async getCartById(id) {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const carts = JSON.parse(data)
        try {
            const cart = carts.find(c => c.id === id)
            if (!cart) {
                return "No se encontro el carrito"
            } else {
                return cart
            }
            
        } catch (error) {
            return error
        }
    }

    async agregarProduct(id, productId) {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const carts = JSON.parse(data)
        try {
            const cartId = carts.find(c => c.id === id)
            if (!cartId || !cartId.products) {
                return "Not Found"
            }
            const product = {
                product: productId,
                quantity: 1
            }
            cartId.products.push(product)
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'))
            console.log("Producto encontrado y actualizado");
        } catch (error) {
            console.log(error);
        }
    }
}


module.exports = cartManager