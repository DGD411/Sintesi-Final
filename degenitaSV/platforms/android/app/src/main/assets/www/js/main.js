window.onload = function() {
    loadItems();
};

function loadItems() {
    // Simulamos una respuesta de la API de Proxmox con el JSON falso
    const fakeApiResponse = {
        "data": [
            {
                "vmid": "101",
                "name": "dev-vm",
                "description": "Development virtual machine for testing.",
                "status": "stopped"
            },
            {
                "vmid": "102",
                "name": "prod-vm",
                "description": "Production virtual machine for web services.",
                "status": "running"
            }
        ]
    };

    // Simulamos la respuesta como si fuera de una petición fetch
    const items = fakeApiResponse.data;

    const itemsList = document.getElementById('items-list');
    itemsList.innerHTML = '';  // Limpiar lista antes de agregar nuevos ítems

    // Iterar sobre los items y agregarlos al DOM
    items.forEach(item => {
        let li = document.createElement('li');
        li.className = 'item'; // Clase para el item
        li.innerHTML = `
            <strong>${item.name}</strong><br>
            Descripción: ${item.description}<br>
            Estado: ${item.status}<br>
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
}

function toggleDropdown(event) {
    const dropdownContent = event.target.nextElementSibling;
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
}

function deleteItem(vmid) {
    alert(`Eliminando item con VMID: ${vmid}`);
    // Aquí puedes agregar la lógica para eliminar el item
}

function modifyItem(vmid) {
    alert(`Modificando item con VMID: ${vmid}`);
    // Aquí puedes agregar la lógica para modificar el item
}

function turnOn(vmid) {
    alert(`Encendiendo item con VMID: ${vmid}`);
    // Aquí puedes agregar la lógica para encender el item
}

function turnOff(vmid) {
    alert(`Apagando item con VMID: ${vmid}`);
    // Aquí puedes agregar la lógica para apagar el item
}

function CrearMV() {
    window.location.href = "crearMV.html";
}
