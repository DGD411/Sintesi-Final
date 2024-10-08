function goToRegister() {
    window.location.href = 'register.html';
}

async function login() {
    const username = document.getElementById('username').value; // Asegúrate de que este ID es correcto
    const password = document.getElementById('password').value;

    if (username && password) {
        try {
            // TODO CAMBIAR IP cuando se tengan
            const response = await fetch(' https://5cb1-37-223-72-245.ngrok-free.app/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username, // Aquí se envía el username
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Login exitoso: ' + data.message);
                window.location.href = 'main.html';
            } else {
                alert('Error en el login: ' + data.detail);
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            alert(error);
        }
    } else {
        alert('Por favor, completa todos los campos');
    }
}

async function register() {
    const user = document.getElementById('user').value; // Asegúrate de que este ID es correcto
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (user && password && confirmPassword) {
        if (password === confirmPassword) {
            try {
                // TODO CAMBIAR IP cuando se tengan
                const response = await fetch('https://5cb1-37-223-72-245.ngrok-free.app/register/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: user, // Aquí se envía el username
                        password: password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Registro exitoso: ' + data.message);
                    window.location.href = 'main.html';
                } else {
                    alert('Error en el registro: ' + data.detail);
                }
            } catch (error) {
                console.error('Error en la petición:', error);
                alert('Hubo un error al intentar registrar el usuario');
            }
        } else {
            alert('Las contraseñas no coinciden');
        }
    } else {
        alert('Por favor, completa todos los campos');
    }
}
