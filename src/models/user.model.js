const mongoose = require("mongoose")

const userCollection = 'user' 

const userSchema = new mongoose.Schema ({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    status: {
        type: Boolean,
        default: true,
    }
})

const Users = mongoose.model(userCollection, userSchema)

module.exports = Users