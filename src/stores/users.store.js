const User = require('../models/usersDB.model')

const create = async (userInfo) => {
    return await User.create(userInfo)
}



module.exports = {
    create,
}