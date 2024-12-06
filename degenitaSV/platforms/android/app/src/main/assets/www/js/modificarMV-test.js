const https = require('https');
const readline = require('readline');

// Parámetros del servidor
const servidor = {
    proxmox_host: "192.168.1.100",  // IP del servidor Proxmox
    node: "node1",                   // Nodo del servidor
    Authorization: "Bearer token"  // Token de autorización
};

// Función para preguntar al usuario
function preguntar(pregunta) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question(pregunta, (respuesta) => {
            rl.close();
            resolve(respuesta);
        });
    });
}

// Modificar una máquina virtual
async function modificarVm(vmId, cambios) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'PUT',
            headers: {
                Authorization: servidor.Authorization,
                'Content-Type': 'application/json',
            },
            rejectUnauthorized: false,
        };

        const url = `https://${servidor.proxmox_host}:8006/api2/json/nodes/${servidor.node}/qemu/${vmId}/config`;
        const req = https.request(url, options, (res) => {
            if (res.statusCode === 200 || res.statusCode === 202) {
                resolve(`Máquina virtual ${vmId} modificada correctamente.`);
            } else {
                let data = '';
                res.on('data', (chunk) => (data += chunk));
                res.on('end', () => reject(`Error: ${res.statusCode} ${data}`));
            }
        });

        req.on('error', (err) => reject(err));
        req.write(JSON.stringify(cambios));
        req.end();
    });
}

// Ejecutar la modificación
async function ejecutar() {
    try {
        console.log("Modificación de una máquina virtual en Proxmox...");

        // Solicitar el ID de la máquina virtual
        const vmId = await preguntar("Ingrese el ID de la MV que desea modificar: ");

        // Solicitar los nuevos parámetros al usuario
        const newName = await preguntar("Ingrese el nuevo nombre (o deje en blanco para no cambiar): ");
        const newMemory = await preguntar("Ingrese la nueva memoria RAM (en MB, o deje en blanco): ");
        const newCores = await preguntar("Ingrese la nueva cantidad de núcleos (o deje en blanco): ");

        // Crear los parámetros de cambio
        const cambios = {};
        if (newName) cambios.name = newName;
        if (newMemory) cambios.memory = parseInt(newMemory);
        if (newCores) cambios.cores = parseInt(newCores);

        if (Object.keys(cambios).length === 0) {
            console.log("No se han proporcionado cambios. Operación cancelada.");
            return;
        }

        // Modificar la máquina virtual
        console.log("Modificando la máquina virtual...");
        const resultado = await modificarVm(vmId, cambios);
        console.log(resultado);

    } catch (error) {
        console.error("Error:", error);
    }
}

// Iniciar la ejecución
ejecutar();
