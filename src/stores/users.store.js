const User = require('../models/usersDB.model')

const create = async (userInfo) => {
    return await User.create(userInfo)
}

const findById = async (uid) => {
    return await User.findById(uid)
}

const findOne = async (email) => {
    return await User.findOne(email)
}

const findByIdAndUpdate = async (id, newRole) => {

    console.log('entroStorgae')
    await User.findByIdAndUpdate(id, { role: newRole })

}



module.exports = {
    create,
    findOne,
    findByIdAndUpdate,
    findById
}