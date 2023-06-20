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

      const cart = new Cart({
        userId: user._id
      })

      await cart.save()

      return user

    } catch (error) {
      return error
    }

  }
}

module.exports = UsuariosDB