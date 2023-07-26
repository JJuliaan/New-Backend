const userStorage = require('../stores/users.store')
const Cart = require('../models/carts.model')
const message = require('../repositories')
const CustomError = require('../handlers/errors/customError')
const generateUsersErrorInfo = require('../handlers/errors/info')
const EnumErrors = require('../handlers/errors/enumError')
const logger = require('../logger/factory')



class UsuariosDB {
  constructor() { }

  async crearUsuario(usuario) {
    try {

      let role = 'usuario'

      if (usuario.email === 'admin@gmail.com' && usuario.password === 'admin') {
        role = 'administrador'
      }

      const user = await userStorage.create(usuario)

      if (usuario.phone) await message.send(usuario)

      const cart = Cart.create({
        userId: user._id
      })

      user.cartId = cart._id


      return user

    } catch (error) {
      throw error
    }

  }

  async findOne(email) {
    try {
      const user = await userStorage.findOne(email)

      return user

    } catch (error) {
      throw error
    }
  }

  async findAndUpdate(uid, newRole) {
    if (newRole !== 'user' && newRole !== 'premium') {
      return 'Rol inválido'
    }

    const actualizado = await userStorage.findByIdAndUpdate(uid, newRole)
  

    return actualizado

  }
}

module.exports = UsuariosDB