const ProductManager = require("../fileManager/productManager")
const path = require("path")
const producto = new ProductManager(path.join(__dirname, "../../files/products.json"))
const uploader = require("../../ultis/multer.ultis")
const { Router } = require("express")

const router = Router()

router.get('/', async (req, res) => {
    const { limit } = req.query
    const products = await producto.getProducts()
    if (limit) {
        res.send({products: products.slice(0,limit)})
    } else {
        res.render('index.handlebars')
        // res.send({ products: products })
    }
})

router.get('/:pid',  async (req, res) => {
    const pid = parseInt(req.params.pid)
    const productPid = await producto.getProductsById(pid)
    console.log(productPid);
    res.send({pid: productPid})

})

router.put('/:pid', (req, res) => {
    const pid = parseInt(req.params.pid)
    const nuevo = req.body
    producto.updateProduct(pid, nuevo)
    // console.log(pid);
    res.json({message: "Producto actualizado"})
})

router.post('/',uploader.array('thumbnail') , (req,res) => {
    if(!req.file) res.status(400).json({status: 'error'})
    res.render('index.handlebars')
    const newProduct = req.body
    newProduct.thumbnail = req.file.path
    // console.log(newProduct);
    producto.addProduct(newProduct)
    // res.json({message: "Producto creado"})
})

router.delete('/:pid', (req, res) => {
    const pid = parseInt(req.params.pid)
    producto.deleteProduct(pid)
    // console.log(pid);
    res.json({message: "Producto eliminado"})
})




module.exports = router