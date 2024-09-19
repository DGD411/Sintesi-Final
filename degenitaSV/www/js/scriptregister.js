function goToRegister() {
    window.location.href = 'register.html';
}

function login() {
    // Lógica para login (ejemplo básico)
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        alert('Login exitoso');
        // Aquí puedes agregar la lógica para autenticar
    } else {
        alert('Por favor, completa todos los campos');
    }
}

function register() {
    // Lógica para registro (ejemplo básico)
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (email && password && confirmPassword) {
        if (password === confirmPassword) {
            alert('Registro exitoso');
            // Aquí puedes agregar la lógica para el registro
        } else {
            alert('Las contraseñas no coinciden');
        }
    } else {
        alert('Por favor, completa todos los campos');
    }
}
