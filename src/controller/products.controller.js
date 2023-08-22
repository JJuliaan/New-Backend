const { Router } = require('express')
const uploader = require('../ultis/multer.ultis')
const FileManager = require('../service/FileManager.service')
const ProductsDao = require('../service/products.service')
const Cart = require('../models/carts.model')
const privateAccess = require('../middlewares/privateAccess.middlewares')
const premiumAccess = require('../middlewares/premiumAccess.midelware')
const adminAccess = require('../middlewares/adminAccess.midelware')
const MailAdapter = require('../adapters/mail.adapter')
const CartsDao = require('../service/cart.service')
const Carts = new CartsDao()
const mailAdapter = new MailAdapter()
const router = Router()
const fileManager = new FileManager()
const Products = new ProductsDao()

router.delete('/deleteAll', async (req, res) => {
    await Products.deleteAll()
    res.json({ message: 'TODO ELIMINADO' })
})

router.get('/mockingproducts', async (req, res) => {
    try {
        const newProducts = await Products.mocking()

        res.json({ products: newProducts })

    } catch (error) {
        console.log(error.message)
        res.json({ error })
    }
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

router.get('/', privateAccess, async (req, res) => {
    try {
        // const userId = req.user._id; 
        // let cartId = req.cookies.cartId;
        // if (!cartId) {
        //     const newCart = await Cart.createForUser(userId); // Utiliza el método para crear un nuevo carrito o recuperar uno existente
        //     cartId = newCart._id.toString();
        //     res.cookie('cartId', cartId, { maxAge: 3600000 });
        // }
        
        const cartId = req.user.cartId

        console.log(cartId)



        const limit = parseInt(req.query.limit)

        const page = parseInt(req.query.page)

        const sort = req.query.sort === 'asc' ? 'price' : req.query.sort === 'desc' ? '-price' : null;

        const query = req.query.query ? { $or: [{ title: { $regex: req.query.query, $options: 'i' } }, { description: { $regex: req.query.query, $options: 'i' } }] } : {};


        const products = await Products.find(query, { limit, page, sort }, cartId)

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

router.post('/', premiumAccess, adminAccess, uploader.single('file'), async (req, res) => {
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
            thumbnail: req.file.filename,
            owner: ownerId
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

router.delete('/:pid', premiumAccess, async (req, res) => {
    try {
        const pid = req.params.pid

        if (req.user.role === 'admin' || (req.user.role === 'premium' && req.user._id.toString() === product.owner.toString())) {
            const deleteProduct = await Products.delete(pid)
            res.json({ message: "Producto eliminado", products: deleteProduct })
        }

        res.status(403).json({ status: 'error', error: 'Acceso no autorizado' })

    } catch (error) {
        console.log(error.message);
    }
})

router.delete('/:pid', adminAccess, async (req, res) => {
    try {
        const pid = req.params.pid;

        const product = await Products.findOneId(pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        if (req.user.role === 'admin' || (req.user.role === 'premium' && req.user._id.toString() === product.owner.toString())) {
            const deleteProduct = await Products.delete(pid);

            if (req.user.role === 'premium') {
                const usuario = req.user;
                await mailAdapter.sendProductDeletedNotification(usuario, product.title);
            }

            res.json({ message: 'Producto eliminado', products: deleteProduct });
        } else {
            res.status(403).json({ status: 'error', error: 'Acceso no autorizado' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
})


module.exports = router