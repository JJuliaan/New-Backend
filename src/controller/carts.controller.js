const { Router } = require('express')
const faker = require('faker')
const CartsDao = require('../service/cart.service')
const ticketDao = require('../service/tickets.service')
const logger = require('../logger/factory')
const MailAdapter = require('../adapters/mail.adapter')
const mailAdapter = new MailAdapter()
const Ticket = new ticketDao()
const Carts = new CartsDao()
const router = Router()


router.post('/:cid/comprar', async (req, res) => {
    try {
        const user = req.user
        const cartId = req.params.cid;
        const cardNumber = faker.datatype({ min: 1000000000000000, max: 9999999999999999 }).toString();
        const expiryDate = faker.date.future().toLocaleDateString('en-US', { year: '2-digit', month: '2-digit' });
        const cvv = faker.datatype({ min: 100, max: 999 }).toString();
        const shippingAddress = faker.address.streetAddress();

        const cardNumberRegex = /^\d{16}$/;
        const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        const cvvRegex = /^\d{3}$/;

        if (!cardNumber.match(cardNumberRegex) || !expiryDate.match(expiryDateRegex) || !cvv.match(cvvRegex)) {
            return res.status(400).json({ error: 'Datos de tarjeta inválidos' });
        }

        if (shippingAddress.trim() === '') {
            return res.status(400).json({ error: 'Dirección de envío inválida' });
        }

        const newTicket = await Ticket.create(cartId);
        await mailAdapter.sendPurchaseConfirmation(user)

        await Carts.borrarProduct(cartId);

        res.json({ message: 'Compra finalizada exitosamente', Ticket: newTicket });
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
        res.status(500).json({ error: 'Ha ocurrido un error al finalizar la compra' });
    }
});



router.delete('/peligroDelete', async (req, res) => {
    await Carts.delete()
    res.json({ message: "TODO ELIMINADO F" })
})

router.get('/all', async (req, res) => {
    try {
        res.json({ carts: await Carts.findAll() })
    } catch (error) {
        logger.error(error)
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid
        const cart = await Carts.findById(cid)

        res.render('cart.handlebars', { cart })
    } catch (error) {
        logger.error(error)
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
        const cid = req.params.cid;
        const pid = req.params.pid;
        const userId = req.user._id;

        const newProduct = await Carts.agregateProduct(cid, pid, userId);

        res.json({ message: 'Se agrego correctamente'});
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});


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