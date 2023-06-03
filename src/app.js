const express = require('express');
const handlebars = require('express-handlebars')
const MongoStore = require('connect-mongo')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const hbs = handlebars.create({
    handlebars: allowInsecurePrototypeAccess(require('handlebars')),
    defaultLayout: 'main'
});
const cookieParser = require('cookie-parser')
const router = require('./routerApp')
const dbConnect = require('../db')
const passport = require('passport');
const { dbAdmin, dbPassword, dbHost, dbName } = require('./config/db.config')

const app = express()


const morgan = require('morgan');
const session = require('express-session');
const initializePassport = require('./config/passport.config');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

app.use(cookieParser());

app.use(morgan('dev'))

app.engine('handlebars', hbs.engine)
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${dbAdmin}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }
    }),
    secret: 'backSecret',
    resave: false,
    saveUninitialized: false
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

router(app)
dbConnect()


module.exports = app