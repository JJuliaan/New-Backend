//Controladores de Files
const cartsRouterFile = require('../fsMnager/fileSystem/carts.routerFile')
const productsRouterFile = require('../fsMnager/fileSystem/products.routerFile')
const realTimeRouter = require('../fsMnager/fileSystem/realTime.router')

//Controladores de mongoose
const usersControllerFile = require('../controller/usersFile.controller')
const usersControllerDB = require('../controller/usersDB.controller')
const productsController = require('../controller/products.controller')
const cartsController = require('../controller/carts.controller')
const messagesController = require('../controller/message.controller')
const authController = require('../auth/authControler')

const loggerTest = require('../controller/loggerTest.controller')

const router = app => {
    // app.use('*', (req, res) => {
    //     res.status(404).json({error: 'Not fund'})
    // })
    app.use('/api/products', productsRouterFile)
    app.use('/api/carts', cartsRouterFile)
    app.use('/realTimeProducts', realTimeRouter)
    app.use('/usersFILE', usersControllerFile)
    app.use('/carts', cartsController)
    app.use('/products', productsController)
    app.use('/message', messagesController)
    app.use('/users', usersControllerDB)
    app.use('/auth', authController)
    app.use('/loggerTest', loggerTest)
}

module.exports = router