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

// Obtener el siguiente ID disponible para la máquina virtual
async function obtenerSiguienteVmId() {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            headers: { Authorization: servidor.Authorization },
            rejectUnauthorized: false,
        };

        const url = `https://${servidor.proxmox_host}:8006/api2/json/cluster/nextid`;
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const vmId = JSON.parse(data).data;
                    resolve(vmId);
                } else {
                    reject(`Error: ${res.statusCode} ${res.statusMessage}`);
                }
            });
        }).on('error', (err) => reject(err));
    });
}

// Crear una máquina virtual
async function crearVm(vmId, parametros) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            headers: {
                Authorization: servidor.Authorization,
                'Content-Type': 'application/json',
            },
            rejectUnauthorized: false,
        };

        const url = `https://${servidor.proxmox_host}:8006/api2/json/nodes/${servidor.node}/qemu`;
        const req = https.request(url, options, (res) => {
            if (res.statusCode === 200 || res.statusCode === 202) {
                resolve(`Máquina virtual ${vmId} creada correctamente.`);
            } else {
                let data = '';
                res.on('data', (chunk) => (data += chunk));
                res.on('end', () => reject(`Error: ${res.statusCode} ${data}`));
            }
        });

        req.on('error', (err) => reject(err));
        req.write(JSON.stringify(parametros));
        req.end();
    });
}

// Ejecutar la operación
async function ejecutar() {
    try {
        console.log("Creación de una nueva máquina virtual en Proxmox...");

        // Obtener el siguiente VM ID
        const vmId = await obtenerSiguienteVmId();
        console.log(`El siguiente ID disponible para la máquina virtual es: ${vmId}`);

        // Solicitar detalles al usuario
        const name = await preguntar("Ingrese el nombre de la MV: ");
        const memory = await preguntar("Ingrese la memoria RAM (en MB): ");
        const diskSize = await preguntar("Ingrese el tamaño del disco (en GB): ");
        const cores = await preguntar("Ingrese la cantidad de núcleos de CPU: ");
        const osType = await preguntar("Ingrese el tipo de sistema operativo (ej. win10, l26): ");

        // Crear parámetros para la solicitud
        const parametros = {
            vmid: vmId,
            name: name,
            ostype: osType,
            memory: parseInt(memory),
            cores: parseInt(cores),
            net0: "virtio,bridge=vmbr0,firewall=1",
            scsi0: `local:${diskSize}G`,
            bios: "ovmf",
        };

        // Crear la máquina virtual
        console.log("Creando la máquina virtual...");
        const resultado = await crearVm(vmId, parametros);
        console.log(resultado);

    } catch (error) {
        console.error("Error:", error);
    }
}

// Iniciar la ejecución
ejecutar();
