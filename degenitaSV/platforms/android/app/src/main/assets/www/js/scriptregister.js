function goToRegister() {
    window.location.href = 'register.html';
}

async function login() {
    const username = document.getElementById('username').value; // Asegúrate de que este ID es correcto
    const password = document.getElementById('password').value;

    if (username && password) {
        try {
            // TODO CAMBIAR IP cuando se tengan
            const response = await fetch('https://bpn94dlcmk.execute-api.eu-north-1.amazonaws.com/Dev/login', {
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

            // Verificar el statusCode en el cuerpo de la respuesta
            if (response.ok && data.statusCode === 200) {
                alert('Login exitoso: ' + data.message);
                window.location.href = 'main.html';
            } else {
                // Si hay un error, se muestra el error correspondiente
                if (data.error) {
                    alert('Error en el login: ' + data.error);
                } else {
                    alert('Error desconocido en el login');
                }
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
                const response = await fetch('https://bpn94dlcmk.execute-api.eu-north-1.amazonaws.com/Dev/register', {
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

                // Verificar el statusCode en el cuerpo de la respuesta
                if (response.ok && data.statusCode === 201) {
                    alert('Registro exitoso: ' + data.message);
                    window.location.href = 'main.html';
                } else {
                    // Si hay un error, se muestra el error correspondiente
                    if (data.error) {
                        alert('Error en el registro: ' + data.error);
                    } else {
                        alert('Error desconocido en el registro');
                    }
                }
            } catch (error) {
                console.error('Error en la petición:', error);
                alert('Hubo un error al intentar registrar el usuario: ' + error.message);
            }
        } else {
            alert('Las contraseñas no coinciden');
        }
    } else {
        alert('Por favor, completa todos los campos');
    }
}
