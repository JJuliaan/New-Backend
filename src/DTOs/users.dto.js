const { createHash } = require("../ultis/cryptPassword")

class UserDTO {
    constructor(info) {
        this.first_name = info.first_name
        this.last_name = info.last_name
        this.email = info.email
        this.password = createHash(info.password)
        this.phone = info.phone
        this.role = info.role
    }
}

module.exports = UserDTO