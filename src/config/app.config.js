require('dotenv').config()

module.exports = {
    port: process.env.app,
    enviroment: process.env.NODE_ENV
}