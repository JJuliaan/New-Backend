const { Router } = require('express')
const UsuariosDB = require('../service/users.service')
const passport = require('passport')
const Users = new UsuariosDB()
const router = Router()
const publicAccess = require('../middlewares/publicAccess.middlewars')
const privateAccess = require('../middlewares/privateAccess.middlewares')
const MailAdapter = require('../adapters/mail.adapter')
const logger = require('../logger/factory')
const generateUniqueCode = require('../ultis/generateUniqueCode.utils')
const { createHash } = require('../ultis/cryptPassword')
const adminAccess = require('../middlewares/adminAccess.midelware')

const mailAdapter = new MailAdapter()

router.get('/', publicAccess, async (req, res) => {
    res.json({ message: 'Hi server' })
    // res.render('signup.handlebars')
})



router.post('/', passport.authenticate('register', { failureRedirect: '/users/failregister' }), async (req, res) => {
    try {

        res.status(201).json({ Status: 'succes', message: 'usuario registrado' })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ Status: 'error', error: 'Internal server error' })
        console.log(error.message)
    }
})

router.get('/profile', privateAccess, async (req, res) => {
    res.render('profile', {
        user: req.user
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err)
        }
        res.redirect('/auth')
    })
})

router.get('/failregister', (req, res) => {
    console.log('falló estrategia de registro!')

    res.json({ error: 'Failed register' })
})

router.put('/premium/:uid', adminAccess, async (req, res) => {
    const userId = req.params.uid
    const newRole = req.body.newRole

    if (req.user.role !== 'admin') {
        return res.status(403).json({ status: 'error', error: 'Acceso no autorizado' })
    }

    // console.log('New Role:', newRole)

    await Users.findAndUpdate(userId, newRole)
    return res.json({ status: 'success', message: 'Rol de usuario actualizado exitosamente' })
})

router.get('/recover', async (req, res) => {
    res.render('recover-password-form')
})

router.post('/recover', async (req, res) => {
    try {
        const { email } = req.body

        const user = await Users.findOne({ email })

        if (!user) {
            return res.status(404).json({ error: 'Correo electrónico no encontrado' })
        }

        const token = generateUniqueCode()

        user.resetPasswordToken = token
        user.resetPasswordExpires = Date.now() + 3600000
        await user.save()


        const resetLink = `http://localhost:8080/users/reset/${token}`
        await mailAdapter.sendRecoveryEmail(user, resetLink)

        res.json({ message: 'Correo de recuperación enviado' })
    } catch (error) {
        logger.error(error.message)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
})

router.get('/reset/:token', async (req, res) => {
    try {
        const { token } = req.params

        const user = await Users.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        })

        if (!user) {
            return res.redirect('/users/recover')
        }

        res.render('reset-password', { token })
    } catch (error) {
        logger.error(error.message)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
})

router.post('/reset/:token', async (req, res) => {
    try {
        const { token } = req.params
        const { password, confirmPassword } = req.body

        if (!token) return res.json('No es valido el token')

        const user = await Users.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        })

        if (!user) {
            logger.error('No se encrontro al usuario')
            return res.redirect('/users/recover')
        }

        if (password === user.password) {
            logger.error('No puedes usar la misma contraseña')
            return res.render('reset-password', { token, message: 'No puedes usar la misma contraseña' })
        }

        if (password !== confirmPassword) {
            logger.error('Las contraseñas no coinciden')
            return res.render('reset-password', { token, message: 'Las contraseñas no coinciden' })
        }

        user.password = createHash(password)
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()

        res.redirect('/auth')
    } catch (error) {
        logger.error(error.message)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
})

module.exports = router