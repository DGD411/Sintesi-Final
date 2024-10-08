document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que se envíe el formulario

        // Aquí podrías validar los datos ingresados si es necesario

        // Simula el proceso de creación de la MV
        alert('Máquina virtual creada con éxito.');

        // Redirige a main.html
        window.location.href = 'main.html';
    });
});
