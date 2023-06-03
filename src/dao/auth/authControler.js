const { Router } = require('express')
const Users = require('../models/usersDB.model')
const publicAccess = require('../../middlewares/publicAccess.middlewars')
const { isValidPassword } = require('../../ultis/cryptPassword')
const passport = require('passport')
const router = Router()

router.post('/', passport.authenticate('login', { failureRedirect: 'auth/faillogin' }), async (req, res) => {
    try {

        if (!req.user) return res.status(401).json({ status: 'error', error: 'El usuario y la contraseña no coinciden' })


        req.session.user = {
            _id: req.user._id,
            first_name: req.user.first_name,
            email: req.user.email,
            role: req.user.role
        }

        res.json({ status: 'success', message: 'Sesion iniciada' })
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal server error' })
    }
})

router.get('/github', passport.authenticate('github', { scope: ['user: email'] }), async (req, res) => {
    res.json({ message: 'Inicio Correcto' })
})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: 'auth/faillogin' }), async (req, res) => {
    req.session.user = req.user
    res.redirect('/products')
})

router.get('/', async (req, res) => {
    res.render('login.handlebars')
})

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) return res.json({ error })
        res.redirect('/users')
    })
})

router.get('/faillogin', (req, res) => {
    try {
        console.log('falló estrategia de autenticacion')
        res.json({ error: 'Failed login' })

    } catch (error) {
        console.log(error.message);
    }
})

module.exports = router