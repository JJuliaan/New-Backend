const loginForm = document.getElementById('login-form')

loginForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const data = new FormData(loginForm)
    const obj = {}

    data.forEach((value, key) => obj[key] = value)

    const url = '/auth'
    const headers = {
        'Content-Type': 'application/json',
    } 
    const method = 'POST'
    const body = JSON.stringify(obj)

    fetch(url, {
        headers,
        method,
        body
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error.message))
})