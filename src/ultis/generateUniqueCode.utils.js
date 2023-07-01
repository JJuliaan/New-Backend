function generateUniqueCode() {
    const timestamp = Date.now().toString(36)
    const randomId = Math.random().toString(36).substring(2, 5)

    return timestamp + randomId;
}

module.exports = generateUniqueCode