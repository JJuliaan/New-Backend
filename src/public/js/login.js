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
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            return response.json();
        }
    })
    .then(data => {
        if (data && data.status === 'success') {
            window.location.href = '/users/profile'
        } else {
            console.log('Error')
        }
    })
    .catch(error => console.log(error.message))
})