class MessageRepository {
    constructor(messageTool) {
        this.messageTool = messageTool
    }

    async send(usuario) {
        await this.messageTool.send(usuario)
    }
}

module.exports = MessageRepository