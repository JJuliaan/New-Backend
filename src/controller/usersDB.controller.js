const { Router } = require('express')
const UsuariosDB = require('../service/users.service')
const passport = require('passport')
const Users = new UsuariosDB()
const usersModel = require('../models/usersDB.model')
const Cart = require('../service/cart.service')
const cartService = new Cart()
const router = Router()
const publicAccess = require('../middlewares/publicAccess.middlewars')
const privateAccess = require('../middlewares/privateAccess.middlewares')
const MailAdapter = require('../adapters/mail.adapter')
const logger = require('../logger/factory')
const generateUniqueCode = require('../ultis/generateUniqueCode.utils')
const { createHash } = require('../ultis/cryptPassword')
const adminAccess = require('../middlewares/adminAccess.midelware')
const path = require('path')
const upload = require('../config/multer.config')


const mailAdapter = new MailAdapter()

router.get('/api/users', adminAccess, async (req, res) => {
    try {
        const users = await usersModel.find()
        // const simplifiedUsers = users.map(user => ({
        //     name: user.first_name,
        //     surname: user.last_name,
        //     email: user.email,
        //     role: user.role
        // }))
        res.render('users', { users })
    } catch (error) {
        logger.error(error.message)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
})

router.delete('/api/users', adminAccess, async (req, res) => {
    try {
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        const inactiveUsers = await usersModel.find({ last_connection: { $lt: twoDaysAgo } })
        await Promise.all(inactiveUsers.map(user => {
            mailAdapter.sendNotificationRemove(user)
            return user.remove()
        }));
        res.json({ message: 'Usuarios inactivos eliminados correctamente.' });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/:uid/role', adminAccess, async (req, res) => {
    try {
        const userId = req.params.uid;
        const newRole = req.body.newRole;

        if (newRole !== 'user' && newRole !== 'premium' && newRole !== 'admin') {
            return res.status(400).json({ error: 'Rol inválido' });
        }

        const user = await usersModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        user.role = newRole;
        await user.save();

        res.json({ message: 'Rol de usuario actualizado correctamente.' });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});



router.delete('/:uid/delete', adminAccess, async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await usersModel.findById(userId)
        if (!user) {
            logger.info('No existe el usuario')
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await mailAdapter.sendNotificationRemove(user)

        await usersModel.findByIdAndRemove(userId)

        res.json({ message: 'Usuario eliminado correctamente.' });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/', (req, res) => {
    res.render('signup')
})

router.post('/', passport.authenticate('register', { failureRedirect: '/users/failregister' }), async (req, res) => {
    try {
        const newUser= req.user
        
        const newCart = await cartService.createForUser(newUser._id)

        newUser.cartId = newCart._id
        await newUser.save()

        res.redirect('/auth')

    } catch (error) {
        console.log(error)
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
        req.user.last_connection = new Date()
        req.user.save().finally(() => {
            res.redirect('/auth')
        })
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

router.post('/:uid/documents', upload.any(), async (req, res, next) => {
    try {
        const userId = req.params.uid
        const user = await usersModel.findById(userId)
        const uploadedDocuments = req.files.map((file) => ({
            name: file.originalname,
            reference: file.filename,
        }))
        user.documents.push(...uploadedDocuments)
        await user.save()
        res.json({ message: 'Document(s) uploaded successfully.' })
    } catch (error) {
        console.error('Error uploading document(s):', error)
        next(error)
    }
})

module.exports = router