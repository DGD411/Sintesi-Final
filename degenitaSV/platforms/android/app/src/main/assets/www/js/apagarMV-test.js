
const https = require('https');
const readline = require('readline');

// Parámetros del servidor
const servidor = {
    proxmox_host: "192.168.1.100",  // IP del servidor Proxmox
    node: "node1",                   // Nodo del servidor
    Authorization: "Bearer YOUR_API_TOKEN"  // Token de autorización
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

// Apagar una máquina virtual
async function apagarVm(vmId) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            headers: { Authorization: servidor.Authorization },
            rejectUnauthorized: false,
        };

        const url = `https://${servidor.proxmox_host}:8006/api2/json/nodes/${servidor.node}/qemu/${vmId}/status/shutdown`;
        https.request(url, options, (res) => {
            if (res.statusCode === 200) {
                resolve(`Máquina virtual ${vmId} apagada correctamente.`);
            } else {
                reject(`Error al apagar la MV: ${res.statusCode} ${res.statusMessage}`);
            }
        }).on('error', (err) => reject(err)).end();
    });
}

// Ejecutar la operación
async function ejecutar() {
    try {
        const vmId = await preguntar("Ingrese el ID de la MV que desea apagar: ");

        // Apagar la MV
        console.log(`Apagando la máquina virtual ${vmId}...`);
        const resultado = await apagarVm(vmId);
        console.log(resultado);

        // Verificar estado
        console.log("Estado después de apagar:");
        const estado = await obtenerEstadoVm(vmId);
        console.log(`Estado actual de la MV ${vmId}: ${estado}`);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Iniciar la ejecución
ejecutar();