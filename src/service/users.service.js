const userStorage = require('../stores/users.store')
const Cart = require('../models/carts.model')
const message = require('../repositories')



class UsuariosDB {
  constructor() { }

  async crearUsuario(usuario) {
    try {

      let role = 'usuario'

      if (usuario.email === 'admin@gmail.com' && usuario.password === 'admin') {
        role = 'administrador'
      }

      const user = await userStorage.create(usuario)

      await message.send(usuario)

      const cart = Cart.create({
        userId: user._id
      })

      user.cartId = cart._id


      return user

    } catch (error) {
      return error
    }

  }
}

module.exports = UsuariosDB