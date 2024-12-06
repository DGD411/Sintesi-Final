// Función para manejar las solicitudes a la API de Proxmox
function makeRequest(method, url, body = null) {
    return fetch(url, {
        method: method,
        headers: {
            'Authorization': servidor.Authorization,
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : null
    }).then(response => {
        // Imprimir la respuesta completa para depuración
        console.log("Respuesta completa de la API:", response);

        if (!response.ok) {
            return response.json().then(err => {
                console.error("Detalles del error:", JSON.stringify(err, null, 2)); // Mostrar errores formateados
                throw new Error(`Error ${response.status}: ${JSON.stringify(err)}`);
            });
        }

        // Si la respuesta es correcta, imprimimos la respuesta
        return response.json().then(data => {
            console.log("Datos de la respuesta:", JSON.stringify(data, null, 2));
            return data;  // Retorna los datos de la respuesta
        });
    });
}

// Función para manejar la creación de la máquina virtual
function createVM(event) {
    event.preventDefault(); // Prevenir el envío predeterminado del formulario

    const vmName = document.getElementById('vm-name').value;
    const ramSize = document.getElementById('ram-size').value;
    const diskSize = document.getElementById('disk-size').value;
    const cpuCores = document.getElementById('cpu-cores').value;

    // Comprobación de datos vacíos
    if (!vmName || !ramSize || !diskSize || !cpuCores) {
        alert("Por favor, rellena todos los campos antes de enviar.");
        return;
    }

    // Mostrar los datos antes de enviarlos
    console.log("Datos de entrada:");
    console.log("Nombre de la VM:", vmName);
    console.log("RAM (MB):", ramSize);
    console.log("Disco (MB):", diskSize);
    console.log("CPU Cores:", cpuCores);

    // Obtener el siguiente VMID disponible
    getNextVMID().then(nextVMID => {
        console.log("El siguiente VMID disponible es:", nextVMID);

        const url = `https://${servidor.proxmox_host}/api2/json/nodes/degenitasv/qemu`;

        // Crear el cuerpo de la solicitud
        const body = {
            vmid: nextVMID,
            name: vmName,
            memory: parseInt(ramSize), // en MB
            cores: parseInt(cpuCores),
            net0: 'virtio,bridge=vmbr0', // Red configurada
            ide2: 'none,media=cdrom', // CD vacío
            ostype: 'l26', // Tipo de SO
            scsi0: `local-lvm:${diskSize}` // Disco configurado
        };

        // Mostrar el cuerpo de la solicitud
        console.log("Cuerpo de la solicitud:");
        console.log(JSON.stringify(body, null, 2)); // Ver cuerpo en consola

        // Realizar la solicitud
        makeRequest('POST', url, body)
            .then(response => {
                console.log("[Create VM] Respuesta de la API:", response);
                alert("Máquina virtual creada correctamente.");
                window.location.href = 'main.html'; // Redirigir tras la creación
            })
            .catch(error => {
                console.error("[Create VM] Error:", error);
                alert(`Error al crear la máquina virtual: ${error.message}`);
            });
    }).catch(error => {
        console.error("[Create VM] Error al obtener VMID:", error);
        alert(`Error al obtener el siguiente VMID: ${error.message}`);
    });
}

