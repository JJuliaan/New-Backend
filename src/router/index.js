//Controladores de Files
const cartsRouterFile = require('../fsMnager/fileSystem/carts.routerFile')
const productsRouterFile = require('../fsMnager/fileSystem/products.routerFile')
const realTimeRouter = require('../fsMnager/fileSystem/realTime.router')

//Controladores de mongoose
const usersControllerFile = require('../dao/DBController/usersFile.controller')
const usersControllerDB = require('../dao/DBController/usersDB.controller')
const productsController = require('../dao/DBController/products.controller')
const cartsController = require('../dao/DBController/carts.controller')
const messagesController = require('../dao/DBController/message.controller')
const authController = require('../dao/auth/authControler')

const router = app => {
    app.use('/api/products', productsRouterFile)
    app.use('/api/carts', cartsRouterFile)
    app.use('/realTimeProducts', realTimeRouter)
    app.use('/usersFILE', usersControllerFile)
    app.use('/carts', cartsController)
    app.use('/products', productsController)
    app.use('/message', messagesController)
    app.use('/users', usersControllerDB)
    app.use('/auth', authController)
}

module.exports = router