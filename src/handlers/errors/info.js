const generateUsersErrorInfo = user => {
    return `One or more propeties were incomplete or not valid.
    List of required propeties:
    first_name: needs to be a strings, recived: ${user.first_name}
    last_name: needs to be a strings, recived: ${user.last_name}
    email: needs to be a strings, recived: ${user.email}
    `
}

module.exports = generateUsersErrorInfo