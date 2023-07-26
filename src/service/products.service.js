const Products = require("../models/products.model")
const paginate = require('mongoose-paginate-v2')
const { port } = require('../config/app.config')
const faker = require("faker")
const generateUniqueCode = require("../ultis/generateUniqueCode.utils")

class ProductsDao {
    constructor() { }

    async insertMany(products) {
        return await Products.insertMany(products)
    }

    async mocking() {

        try {
            const products = []

            for (let i = 0; i < 100; i++) {
                const product = await Products.create({
                    title: faker.commerce.productAdjective(),
                    price: parseFloat(faker.commerce.price()),
                    description: faker.commerce.productDescription(),
                    code: generateUniqueCode(),
                    stock: 15,
                    category: faker.commerce.product(),
                    thumbnail: faker.image.imageUrl()
                })

                products.push(product)
            }

            return await this.insertMany(products)

        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    }

    async findAll() {
        try {
            return await Products.find()

        } catch (error) {
            return error.message
        }
    }

    async find(query, { limit, page, sort }, cartId) {
        try {

            const products = await Products.paginate(query, {
                limit: limit || 10,
                sort: sort === 'asc' ? 'price' : sort === 'desc' ? '-price' : null,
                page: page || 1
            })

            const totalPages = products.totalPages;
            const prevPage = products.prevPage;
            const nextPage = products.nextPage;
            const currentPage = products.page;
            const hasPrevPage = products.hasPrevPage;
            const hasNextPage = products.hasNextPage;
            const prevLink = hasPrevPage ? `http://localhost:${port}/products?page=${prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null
            const nextLink = hasNextPage ? `http://localhost:${port}/products?page=${nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null;

            const objInfo = {
                title: 'Lista de Productos',
                cartId: cartId,
                products: products.docs,
                totalPages: totalPages,
                prevPage: prevPage,
                nextPage: nextPage,
                page: currentPage,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: prevLink,
                nextLink: nextLink,
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true
            }

            return objInfo

        } catch (error) {
            return error
        }
    }

    async findOneId(id) {
        try {
            return Products.findOne({ _id: id })
        } catch (error) {
            return error
        }
    }

    async create(product) {
        const { title, price, description, thumbnail, code, stock, status, category } = product
        const newProduct = {
            title,
            price,
            description,
            code,
            stock,
            status,
            category,
            thumbnail,
            owner: ownerId
        }

        if (!title || !price || !description || !thumbnail || !code || !stock || !category) return 'Faltan datos'

        return await Products.create(newProduct)
    }

    async updateOne(id, update) {
        const { title, price, description, thumbnail, code, stock, status, category } = update
        const updateProduct = {
            title,
            price,
            description,
            thumbnail,
            code,
            stock,
            status,
            category,
            owner: ownerId
        }

        return await Products.updateOne({ _id: id }, updateProduct)
    }

    async delete(id) {
        const product = await Products.findById(id)

        if (!product) {
            return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
        }
        
        return Products.updateOne({ _id: id }, { status: false })
    }

    async deleteAll() {
        return await Products.deleteMany()
    }

}

module.exports = ProductsDao