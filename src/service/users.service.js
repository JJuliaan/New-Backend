const userStorage = require('../stores/users.store')
const Cart = require('../stores/cart.store')
const { createHash } = require('../ultis/cryptPassword')

class UsuariosDB {
    constructor() { }

    async crearUsuario(usuario) {
        try {
            const { first_name, email, password } = usuario

            let role = 'usuario'

            if (email === 'admin@gmail.com' && password === 'admin') {
                role = 'administrador'
            }
            // console.log(usuario);
            const newUsuarioInfo = {
                first_name,
                email,
                password: createHash(password),
                role
            }

            const user = await userStorage.create(newUsuarioInfo)
            // console.log(newUsuarioInfo)
            // console.log('entro')

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