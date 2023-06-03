const app = require('./app')
const ProductManager = require("./fsMnager/fileManager/productManager");
const path = require("path")
const producto = new ProductManager(path.join(__dirname, "./files/products.json"))
const MessageDao = require('./dao/message.dao')
const Messages = new MessageDao()

const messages = []


const { port } = require('./config/app.config')
const { Server } = require('socket.io')

const httpServer = app.listen(port, () => {
    console.log(`Server running at ${port}`);
})

const io = new Server(httpServer)

io.on('connection', async socket => {
    console.log(socket.id);
    console.log("Ciente conectado")

    const products = await producto.getProducts()
    io.emit('listProducts', { products })

    socket.on('newProduct', product => {
        console.log(product)
        producto.addProduct(product)
        socket.broadcast.emit('listProducts', product)
    })
    
    console.log('Cliente conectado en ' + socket.id);

    // socket.on('message', data =>{
    //     messages.push(data) //Guarda los mensajes que recibe
    //     io.emit('messageLogs', messages) //Muestra en pantalla los mensajes guardados desde el array / DB
    // }) 

    socket.on('message', async ({user,message}) =>{
        const chat = await Messages.create(user,message);
        io.emit('messageFinal', chat)
    })

    socket.on('newUser', user =>{
        socket.broadcast.emit('userConnected', user) //Apenas se conecta uno nuevo, avisa a los demas que se conectó
        socket.emit('messageLogs', messages) //Apenas se conecta uno nuevo, retorna los mensajes guardados en el array / DB
    })



})