const { Router } = require('express')
const Users = require('../models/usersDB.model')
const passport = require('passport')
const logger = require('../logger/factory')
const router = Router()

router.post('/', passport.authenticate('login', { failureRedirect: 'auth/faillogin' }), async (req, res) => {
    try {

        if (!req.user) return res.status(401).json({ status: 'error', error: 'El usuario y la contraseña no coinciden' })

        req.user.last_connection = new Date();
        await req.user.save();

        req.session.user = {
            _id: req.user._id,
            first_name: req.user.first_name,
            email: req.user.email,
            role: req.user.role
        }

        res.redirect('/users/profile')
        // res.json({ status: 'success', message: 'Sesion iniciada' })
    } catch (error) {
        logger.error(error.message)
        res.status(500).json({ status: 'error', error: 'Internal server error' })
    }
})

router.get('/github', passport.authenticate('github', { scope: ['user: email'] }), async (req, res) => {
    res.json({ message: 'Inicio Correcto' })
})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: 'auth/faillogin' }), async (req, res) => {
    req.session.user = req.user
    res.redirect('/users/profile')
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
        res.json({ error: 'Failed login' })
        logger.error('falló estrategia de autenticacion')

    } catch (error) {
        logger.error(error.message)
    }
})

module.exports = router