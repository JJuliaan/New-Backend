const { port } = require('./config/app.config')
const { Server } = require('socket.io');
const express = require('express');
const handlebars = require('express-handlebars')
const MongoStore = require('connect-mongo')
const compression = require('express-compression')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const router = require('./router')
const app = express()
const session = require('express-session');

// Swagger
const swaggerJsondoc = require('swagger-jsdoc')
const swaggerUiExpress = require('swagger-ui-express')

// Method
const methodOverride = require('method-override')

//cookieParser
const cookieParser = require('cookie-parser')


//Mongo
const MongoConnect = require('../db')
const { dbAdmin, dbPassword, dbHost, dbName } = require('./config/db.config')

//Passport
const passport = require('passport');
const initializePassport = require('./config/passport.config');

//Logger
const logger = require('./logger/factory')
const errorHandler = require('./middlewares/errors');
const addLogger = require('./middlewares/logger.midelwares');



//Morgan
const morgan = require('morgan');
const { default: mongoose } = require('mongoose');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

app.use(cookieParser());

app.use(morgan('dev'))

const hbs = handlebars.create({
    handlebars: allowInsecurePrototypeAccess(require('handlebars')),
    defaultLayout: 'main',
    helpers: {
        calculateTotal: function (cartItems) {
            let total = 0;
            for (const item of cartItems) {
                total += item.products.price * item.quantity;
            }
            return total.toFixed(2);
        }
    }
});
app.engine('handlebars', hbs.engine)
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(methodOverride('_method'))
const connection = mongoose.connect(process.env.MONGO_URL)
app.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${dbAdmin}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }
    }),
    secret: 'backSecret',
    resave: false,
    saveUninitialized: false
}))


//swagger documentate

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "Documentacion to my project",
            description: "Endpoints to Manager Products and carts in my ecommerce aplication."
        }
    },
    apis: [`${__dirname.replace(/\\/g, '/')}/docs/**/*.yaml`]
}

const swaggerSpecs = swaggerJsondoc(swaggerOptions)



app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpecs))

app.use(addLogger)

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(errorHandler)

app.use(compression({
    brotli: { enabled: true, zlib: {} }
})
)

router(app)
const connect = MongoConnect.getInstance()




const httpServer = app.listen(port, () => {
    logger.info(`Server running at ${port}`);
})

const io = new Server(httpServer)

module.exports = app