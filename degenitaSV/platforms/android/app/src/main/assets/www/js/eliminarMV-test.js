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

// Obtener la lista de máquinas virtuales
async function obtenerVmIds() {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            headers: { Authorization: servidor.Authorization },
            rejectUnauthorized: false, // Evitar errores de certificados no válidos
        };

        const url = `https://${servidor.proxmox_host}:8006/api2/json/nodes/${servidor.node}/qemu`;
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const vms = JSON.parse(data).data.map((vm) => vm.vmid);
                    resolve(vms);
                } else {
                    reject(`Error: ${res.statusCode} ${res.statusMessage}`);
                }
            });
        }).on('error', (err) => reject(err));
    });
}

// Eliminar una máquina virtual
async function eliminarVm(vmId) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'DELETE',
            headers: { Authorization: servidor.Authorization },
            rejectUnauthorized: false,
        };

        const url = `https://${servidor.proxmox_host}:8006/api2/json/nodes/${servidor.node}/qemu/${vmId}`;
        https.request(url, options, (res) => {
            if (res.statusCode === 200) {
                resolve(`Máquina virtual eliminada: ${vmId}`);
            } else {
                reject(`Error al eliminar la MV: ${res.statusCode} ${res.statusMessage}`);
            }
        }).on('error', (err) => reject(err)).end();
    });
}

// Ejecutar la operación
async function ejecutar() {
    try {
        console.log("Obteniendo máquinas virtuales...");
        const vms = await obtenerVmIds();
        if (vms.length === 0) {
            console.log("No hay máquinas virtuales disponibles.");
            return;
        }

        console.log("Máquinas virtuales disponibles:");
        vms.forEach((vm) => console.log(`- ${vm}`));

        const vmId = await preguntar("Ingrese el ID de la MV que desea eliminar: ");
        const confirmacion = await preguntar(`¿Está seguro de que desea eliminar la MV ${vmId}? (sí/no): `);

        if (confirmacion.toLowerCase() === "sí") {
            const resultado = await eliminarVm(vmId);
            console.log(resultado);
        } else {
            console.log("Operación cancelada.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Iniciar la ejecución
ejecutar();