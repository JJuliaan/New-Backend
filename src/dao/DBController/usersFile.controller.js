const { Router } = require('express')
const Users = require('../models/user.model')
const router = Router()

router.get('/', async (req, res) => {
    try {
        const users = await Users.find({ status: true})

        res.json({ messaje: users})
    } catch (error) {
        
    }
})

router.post('/', async (req, res) => {
    try {
        const {first_name, last_name, email} = req.body
        const newUserInfo = {
            first_name,
            last_name,
            email,
        }

        if (!first_name || !last_name || !email) return res.json({error: "Esta incompleto"})

        const newUser = await Users.create(newUserInfo)

        res.json({ message: newUser })
        // todo bien
        res.status(201).json({message: "Usuario creado"})
    } catch (error) {
        console.log(error)
        if(error = 11000) {
            console.log(error.message)
            //error de el
            res.status(400).json({error: 'El usuario ya existe'})
        }
    }
})

router.put('/:uid', async(req, res) =>{
    try {
        const uid = req.params.uid
        const { first_name, last_name, email } = req.body
        const updateUser = {
            first_name,
            last_name,
            email
        }
    
        const userUpdate = await Users.updateOne({_id: uid}, updateUser)
        res.json({ message: userUpdate})
        
    } catch (error) {
        res.json(error);
    }
})

router.delete('/:uid', async (req, res) => {
    try {
        const uid = req.params.uid
    
        const userUpdate = await Users.updateOne({_id: uid}, {status: false})
        res.json({ message: userUpdate})
        
    } catch (error) {
        res.json(error);
    }
})


module.exports = router