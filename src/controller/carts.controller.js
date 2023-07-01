const { Router } = require('express')
const CartsDao = require('../service/cart.service')
const ticketDao = require('../service/tickets.service')
const Ticket = new ticketDao()
const Carts = new CartsDao()
const router = Router()


router.post('/:cid/pucharse', async (req, res) => {
    try {
        const cartId = req.params.cid
        
        const newTicket = await Ticket.create(cartId)

        res.json({ message: 'Compra finalizada exitosamente', Ticket: newTicket })
        
    } catch (error) {
        console.error('Error al finalizar la compra:', error)
        res.status(500).json({ error: 'Ha ocurrido un error al finalizar la compra' })
    }

})


router.delete('/peligroDelete', async (req, res) => {
    await Carts.delete()
    res.json({ message: "TODO ELIMINADO F" })
})

router.get('/all', async (req, res) => {
    try {
        res.json({ carts: await Carts.findAll() })
    } catch (error) {
        console.log(error)
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid
        const cart = await Carts.findById(cid)

        res.render('cart.handlebars', { cart })
    } catch (error) {
        console.log(error)
    }
})


router.post('/', async (req, res) => {
    try {
        res.json({ message: await Carts.create() })
    } catch (error) {
        res.json({ message: error })
    }
})

router.post('/:cid/:pid', async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid

        const newProduct = await Carts.agregateProduct(cid, pid)

        res.json({ newProduct })
    } catch (error) {
        console.log(error.message);
    }
})

router.put('/:cid/products/:pid', async (req, res) => {
    try {

        const cid = req.params.cid
        const pid = req.params.pid
        const quantity = req.body.quantity

        const newCantidad = await Carts.actualizarCantidad(cid, pid, quantity)
        res.json({ message: 'Producto actualizado', newCantidad })
    } catch (error) {
        res.json({ error })
    }
})

router.delete('/:cid', async (req, res) => {

    try {
        const cid = req.params.cid

        const borrar = await Carts.borrarProduct(cid)
        res.json({ message: 'Carrito Borrado', borrar })

    } catch (error) {
        res.json({ error })
    }
})

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const borrar = await Carts.borrarOne(cid, pid)

        res.json({ borrar })

    } catch (error) {
        res.json({ error })
    }

})
module.exports = router