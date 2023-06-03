const { Router } = require('express')
const uploader = require('../../ultis/multer.ultis')
const FileManager = require('../FileManager.daos')
const ProductsDao = require('../products.dao')
const Cart = require('../models/carts.model')
const router = Router()
const fileManager = new FileManager()
const Products = new ProductsDao()

router.delete('/deleteAll', async (req, res) => {
    await Products.deleteAll()
    res.json({ message: 'TODO ELIMINADO' })
})

router.get('/loadItems', async (req, res) => {
    try {
        const products = await fileManager.loadItems()

        const newProducts = await Products.insertMany(products)

        res.json({ message: newProducts })
    } catch (error) {
        console.log(error.message);
        res.json({ error })
    }
})

router.get('/all', async (req, res) => {
    res.json({ poducts: await Products.findAll() })
})

router.get('/', async (req, res) => {
    try {

        let cartId = req.cookies.cartId;
        if (!cartId) {
            const newCart = await Cart.create({});
            cartId = newCart._id.toString();
            res.cookie('cartId', cartId, { maxAge: 3600000 });
        }

        

        const limit = parseInt(req.query.limit)

        const page = parseInt(req.query.page)

        const sort = req.query.sort === 'asc' ? 'price' : req.query.sort === 'desc' ? '-price' : null;

        const query = req.query.query ? { $or: [{ title: { $regex: req.query.query, $options: 'i' } }, { description: { $regex: req.query.query, $options: 'i' } }] } : {};


        const products = await Products.find(query, { limit, page, sort }, cartId)

        console.log(products)
        res.render('products.handlebars', products)


    } catch (error) {
        console.log(error.message)
        res.status(400).json({ error: 'llal' })
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid

        const buscador = await Products.findOneId(pid)

        res.json({ message: buscador })

    } catch (error) {
        console.log(error.message)
        res.status(400).json({ error: 'El Producto no pudo ser creado' })
    }
})

router.post('/', uploader.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ status: "error" })
        const { title, price, description, code, stock, status, category } = req.body
        const newProduct = {
            title,
            price,
            description,
            code,
            stock,
            status,
            category,
            thumbnail: req.file.filename
        }

        const newsProducts = await Products.create(newProduct)


        res.status(201).json({
            message: "Producto creado",
            product: newsProducts
        })

    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error })
    }
})

router.put('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid
        const updateProduct = req.body

        const productUpdate = await Products.updateOne({ _id: pid }, updateProduct)
        res.json({ message: productUpdate })

    } catch (error) {
        res.json(error);
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid

        const deleteProduct = await Products.delete(pid)
        res.json({ message: "Producto eliminado", products: deleteProduct })
    } catch (error) {
        console.log(error.message);
    }
})


module.exports = router