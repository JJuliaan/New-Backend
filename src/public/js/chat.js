const socket = io();
//const productsContainer = document.getElementById("products");
const chat = document.getElementById('messageLogs')

const swal = async () => {
    const chatBox = document.getElementById('chatBox')

    try {
        const result = await Swal.fire({
            title: 'Bienvenidos al chat',
            input: 'text',
            text: 'Por favor identificate como usuario',
            inputValidator: value => {
                return !value && 'Necesitas ingresar un usuario para continuar'
            },
            allowOutsideClick: false
        })
        const user = result.value

        socket.emit('newUser', user)

        socket.on('userConnected', user => {
            swal.fire({
                text: `Bienvenido ${user} al chat`,
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                icon: 'success',
                background: '#e1e1e1'
            })
        })

        chatBox.addEventListener('keyup', e => {
            if (e.key === 'Enter') {
                if (chatBox.value.trim().length > 0) {
                    const newMessage = {
                        user: user,
                        message: chatBox.value
                    }
                    socket.emit('message', newMessage)
                    chatBox.value = ''
                }
            }
        })

    } catch (error) {
        console.log(error);
    }
}

const newMessage = (data) => {
    const { user, message } = data
    const chat = document.createElement('p')
    chat.innerHTML = `
      ${user}: ${message}
  `
    return chat
}

socket.on('messageFinal', data => {
    chat.append(newMessage(data))
})

swal()