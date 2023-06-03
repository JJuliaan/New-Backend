function privateAccess(req, res, next){
    if(!req.session.user) return res.redirect('/auth')

    next()
}

module.exports = privateAccess