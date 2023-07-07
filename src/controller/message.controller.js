const { Router } = require('express');
const ChatsDao = require('../service/message.service');
const logger = require('../logger/factory');

const router = Router();
const Chats = new ChatsDao()

router.get('/', async (req, res) => {
    try {
        const chats = await Chats.getChats()
        res.render('chat.handlebars', { chats, title: "Chat" })
    } catch (error) {
        res.status(400).json({ error: error })
    }
})

router.post('/', async (req, res) => {
    try {
        const { user, message } = req.body
        const msj = await Chats.create(user, message)
        res.json({ messages: msj })
    } catch (error) {
        logger.error(error.message);
        res.status(400).json({ error: error })
    }
})

module.exports = router