const cartManager = require('../fileManager/cartManager')
const path = require('path')
const cart = new cartManager(path.join(__dirname, '../../files/cartsProducts.json'))
const { Router } = require('express')

const router = Router()

router.post('/', async(req, res) => {
    const newCart = req.body
    cart.construirCart(newCart)
    res.json({ message: "Cart creado con exito"})
})

router.get('/:cid', async (req, res) => {
    const cid = parseInt(req.params.cid)
    const cartCid = await cart.getCartById(cid)
    console.log(cartCid);
    res.json({ cid: cartCid })

})

router.post('/:cid/products/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid)
    const pid = parseInt(req.params.pid)

    const carritoActualizado = await cart.agregarProduct(cid, pid)
    console.log(carritoActualizado)
    res.json({message: "producto actualizado"})
})


module.exports = router