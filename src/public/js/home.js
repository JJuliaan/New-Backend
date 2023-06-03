const socket = io()

const newProductForm = document.getElementById('newProduct')

newProductForm.addEventListener('submit', e => {
    e.preventDefault()
    const data = new FormData(newProductForm)
    const obj = {}

    data.forEach((value, key) => (obj[key] = value ))
    
    socket.emit('newProduct', obj)
   
})