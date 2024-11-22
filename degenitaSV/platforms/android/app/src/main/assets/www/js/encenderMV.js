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

// Encender una máquina virtual
async function encenderVm(vmId) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            headers: { Authorization: servidor.Authorization },
            rejectUnauthorized: false,
        };

        const url = `https://${servidor.proxmox_host}:8006/api2/json/nodes/${servidor.node}/qemu/${vmId}/status/start`;
        https.request(url, options, (res) => {
            if (res.statusCode === 200) {
                resolve(`Máquina virtual ${vmId} encendida correctamente.`);
            } else {
                reject(`Error al encender la MV: ${res.statusCode} ${res.statusMessage}`);
            }
        }).on('error', (err) => reject(err)).end();
    });
}

// Verificar el estado de una máquina virtual
async function obtenerEstadoVm(vmId) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            headers: { Authorization: servidor.Authorization },
            rejectUnauthorized: false,
        };

        const url = `https://${servidor.proxmox_host}:8006/api2/json/nodes/${servidor.node}/qemu/${vmId}/status/current`;
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const estado = JSON.parse(data).data.status;
                    resolve(estado);
                } else {
                    reject(`Error al obtener el estado de la MV: ${res.statusCode} ${res.statusMessage}`);
                }
            });
        }).on('error', (err) => reject(err));
    });
}

// Ejecutar la operación
async function ejecutar() {
    try {
        const vmId = await preguntar("Ingrese el ID de la MV que desea encender: ");

        // Encender la MV
        console.log(`Encendiendo la máquina virtual ${vmId}...`);
        const resultado = await encenderVm(vmId);
        console.log(resultado);

        // Verificar el estado
        console.log("Verificando el estado...");
        const estado = await obtenerEstadoVm(vmId);
        console.log(`Estado actual de la MV ${vmId}: ${estado}`);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Iniciar la ejecución
ejecutar();