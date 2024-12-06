// Configuración del servidor Proxmox
const servidor = {
    proxmox_host: "degenitasv.duckdns.org",
    node: "degenitasv",
    Authorization: "PVEAPIToken=root@pam!pam=7930ecaf-d2fc-4df5-9683-6fbe25256ae0"
};

// Función para manejar solicitudes a la API de Proxmox
function makeRequest(method, url, body = null) {
    return fetch(url, {
        method: method,
        headers: {
            'Authorization': servidor.Authorization,
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : null
    }).then(response => {
        if (!response.ok) {
            console.error(`Error ${response.status}: ${response.statusText}`);
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    }).catch(error => {
        console.error("Error en la solicitud:", error);
        throw error;
    });
}


// Función para obtener el siguiente vmid disponible
function getNextVmid() {
    const url = `https://${servidor.proxmox_host}/api2/json/cluster/nextid`;
    return makeRequest('GET', url).then(data => data.data);
}

// Función para crear una nueva máquina virtual
function createVM() {
    const vmName = prompt("Nombre para la nueva máquina virtual:");
    const ramSize = prompt("Cantidad de RAM (en MB):");
    const diskSize = prompt("Tamaño del disco (en GB):") * 1024;
    const cpuCores = prompt("Cantidad de núcleos de CPU:");

    if (!vmName || !ramSize || !diskSize || !cpuCores) {
        alert("Por favor, ingresa todos los datos.");
        return;
    }


    getNextVmid()
        .then(nextVmid => {
            const url = `https://${servidor.proxmox_host}/api2/json/nodes/${servidor.node}/qemu`;
            const body = {
                vmid: nextVmid,
                name: vmName,
                memory: parseInt(ramSize),
                cores: parseInt(cpuCores),
                ide0: `local:${diskSize}`,
                net0: "virtio,bridge=vmbr0",
                ostype: "l26",
                boot: "cdn"
            };

            makeRequest('POST', url, body)
                .then(() => {
                    alert(`Máquina virtual ${vmName} creada con ID ${nextVmid}.`);
                    loadItems();
                })
                .catch(error => {
                    console.error("Error al crear la máquina virtual:", error);
                    alert(`Error al crear la máquina virtual: ${error.message}`);
                });
        })
        .catch(error => {
            console.error("Error al obtener el vmid disponible:", error);
            alert(`Error al obtener el vmid disponible: ${error.message}`);
        });
}

// Función para cargar la lista de máquinas virtuales
function loadItems() {
    const url = `https://${servidor.proxmox_host}/api2/json/nodes/${servidor.node}/qemu`;

    makeRequest('GET', url)
        .then(data => {
            if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
                const items = data.data;
                const itemsList = document.getElementById('items-list');
                itemsList.innerHTML = '';

                items.forEach(item => {
                    let li = document.createElement('li');
                    li.className = 'item';
                    li.innerHTML = `
                        <strong>${item.name || 'Sin nombre'}</strong><br>
                        ID: ${item.vmid}<br>
                        Estado: ${item.status || 'Desconocido'}<br>
                        Máximo de RAM: ${item.maxmem / 1024 / 1024} MB<br>
                        Núcleos: ${item.cpus || 'N/A'}<br>
                        <div class="dropdown">
                            <button class="dropdown-btn" onclick="toggleDropdown(event)">▼</button>
                            <div class="dropdown-content">
                                <button onclick="deleteItem('${item.vmid}')">Eliminar</button>
                                <button onclick="modifyItem('${item.vmid}')">Modificar</button>
                                <button onclick="turnOn('${item.vmid}')">Encender</button>
                                <button onclick="turnOff('${item.vmid}')">Apagar</button>
                            </div>
                        </div>
                    `;
                    itemsList.appendChild(li);
                });
            } else {
                alert("No se encontraron máquinas virtuales.");
            }
        })
        .catch(error => {
            console.error("Error al cargar las máquinas virtuales:", error);
            alert("Error al cargar las máquinas virtuales. Verifica la conexión.");
        });
}

// Función para manejar el menú desplegable
function toggleDropdown(event) {
    const dropdownContent = event.target.nextElementSibling;
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
}

// Función para modificar una máquina virtual
function modifyItem(vmid) {
    const newName = prompt("Ingrese el nuevo nombre para la máquina virtual (o deja vacío para no cambiar):");
    const newMemory = prompt("Ingrese la nueva memoria RAM (en MB) (o deja vacío para no cambiar):");
    const newCores = prompt("Ingrese la nueva cantidad de núcleos (o deja vacío para no cambiar):");

    const url = `https://${servidor.proxmox_host}/api2/json/nodes/${servidor.node}/qemu/${vmid}/config`;
    const body = {};
    if (newName) body.name = newName;
    if (newMemory) body.memory = parseInt(newMemory);
    if (newCores) body.cores = parseInt(newCores);

    if (Object.keys(body).length === 0) {
        alert("No se realizaron cambios.");
        return;
    }

    makeRequest('PUT', url, body)
        .then(() => {
            alert(`Máquina virtual ${vmid} modificada exitosamente.`);
            loadItems();
        })
        .catch(error => {
            console.error("Error al modificar la máquina virtual:", error);
            alert(`Error al modificar la máquina virtual: ${error.message}`);
        });
}

// Función para eliminar una máquina virtual
function deleteItem(vmid) {
    if (!confirm(`¿Estás seguro de que quieres eliminar la máquina virtual con ID ${vmid}?`)) {
        return;
    }

    const url = `https://${servidor.proxmox_host}/api2/json/nodes/${servidor.node}/qemu/${vmid}`;

    makeRequest('DELETE', url)
        .then(() => {
            alert(`Máquina virtual con ID ${vmid} eliminada exitosamente.`);
            loadItems();
        })
        .catch(error => {
            console.error("Error al eliminar la máquina virtual:", error);
            alert(`Error al eliminar la máquina virtual: ${error.message}`);
        });
}

// Función para encender la máquina virtual
function turnOn(vmid) {
    const url = `https://${servidor.proxmox_host}/api2/json/nodes/${servidor.node}/qemu/${vmid}/status/start`;

    // Enviar node y vmid en el body
    const body = {
        node: servidor.node,
        vmid: vmid
    };

    makeRequest('POST', url, body)
        .then(() => {
            alert(`Máquina virtual ${vmid} encendida.`);
            loadItems();
        })
        .catch(error => {
            console.error(`Error al encender la máquina virtual ${vmid}:`, error);
            alert(`Error al encender la máquina virtual: ${error.message}`);
        });
}

// Función para apagar la máquina virtual
function turnOff(vmid) {
    const url = `https://${servidor.proxmox_host}/api2/json/nodes/${servidor.node}/qemu/${vmid}/status/stop`;

    // Enviar node y vmid en el body
    const body = {
        node: servidor.node,
        vmid: vmid
    };

    makeRequest('POST', url, body)
        .then(() => {
            alert(`Máquina virtual ${vmid} apagada.`);
            loadItems();
        })
        .catch(error => {
            console.error(`Error al apagar la máquina virtual ${vmid}:`, error);
            alert(`Error al apagar la máquina virtual: ${error.message}`);
        });
}



// Cargar la lista de máquinas virtuales al inicio
loadItems();
