const userStorage = require('../stores/users.store')
const Cart = require('../models/carts.model')
const message = require('../repositories')
const logger = require('../logger/factory')



class UsuariosDB {
  constructor() { }

  async crearUsuario(usuario) {
    try {

      let role = 'user'

      if (usuario.email === 'admin@gmail.com' && usuario.password === 'admin') {
        role = 'administrador'
      }

      const user = await userStorage.create(usuario)

      if (usuario.phone) await message.send(usuario)


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

    const user = await userStorage.findById(uid)

    if (!user) {
      return 'Usuario no encontrado'
    }

    if (newRole !== 'user' && newRole !== 'premium') {
      return 'Rol inválido'
    }

    const requiredDocuments = ['product', 'profile', 'document'];
    const userDocuments = user.documents.map((doc) => path.basename(doc.name, path.extname(doc.name)));

    const hasAllRequiredDocuments = requiredDocuments.every((doc) => userDocuments.includes(doc));

    if (!hasAllRequiredDocuments) {
      throw new Error('El usuario debe cargar los siguientes documentos: Identificación, Comprobante de domicilio, Comprobante de estado de cuenta');
    }

    const actualizado = await userStorage.findByIdAndUpdate(uid, newRole)

    logger.info('Se cambio el role del usuario', actualizado)
    return actualizado

  }
}

module.exports = UsuariosDB