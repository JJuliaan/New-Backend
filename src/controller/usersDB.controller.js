const { Router } = require('express')
const UsuariosDB = require('../service/users.service')
const passport = require('passport')
const Users = new UsuariosDB()
const router = Router()
const publicAccess = require('../middlewares/publicAccess.middlewars')

router.get('/', publicAccess, async (req, res) => {
    res.json({ message: 'Hi server'})
    // res.render('signup.handlebars')
})



router.post('/', passport.authenticate('register', {failureRedirect: '/users/failregister'}), async (req, res) => {
    try {

        res.status(201).json({Status: 'succes', message: 'usuario registrado'})
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({Status: 'error', error: 'Internal server error'})
        console.log(error.message);
    }
})

router.get('/failregister', (req, res) => {
    console.log('falló estrategia de registro!')
  
    res.json({ error: 'Failed register' })
})



module.exports = router