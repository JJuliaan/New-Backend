const { Router } = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.render('realTimeProducts.handlebars', {
        title: "realtimeproducts",
        style: "style.css"
    })
})

module.exports = router