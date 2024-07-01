# Gestión de Servidores Proxmox - Proyecto de Aplicación Móvil

## Descripción del Proyecto

Nuestra propuesta es desarrollar una aplicación móvil que permita gestionar un servidor Proxmox de manera eficiente y accesible. Proxmox es una plataforma de virtualización de código abierto que integra tecnologías KVM (Kernel-based Virtual Machine) y LXC (Linux Containers), ofreciendo una solución poderosa para la administración de máquinas virtuales y contenedores. A través de nuestra aplicación, los usuarios podrán interactuar con Proxmox utilizando peticiones a su API nativa. Además, crearemos una API propia para gestionar la autenticación y los roles de usuario, proporcionando una experiencia personalizada y segura.

## Objetivos del Proyecto

1. **Desarrollar una aplicación móvil**: Utilizaremos Android y Apache Cordova para construir una aplicación nativa y multiplataforma que sea intuitiva y fácil de usar.
2. **Integración con la API de Proxmox**: Permitirá a los usuarios gestionar servidores, máquinas virtuales y contenedores directamente desde la aplicación.
3. **Crear una API propia para autenticación**: Esta API manejará el inicio de sesión y la asignación de roles de usuario, diferenciando entre administradores y clientes.
4. **Gestión de Roles de Usuario**:
   - **Administrador**: Tendrá acceso completo para ver y gestionar todos los recursos del servidor.
   - **Cliente**: Podrá visualizar y gestionar únicamente sus propias máquinas virtuales.
5. **Base de datos**: Utilizaremos PostgreSQL para almacenar datos de usuarios, roles y configuraciones pertinentes.

## Tecnologías Utilizadas

### Desarrollo de la Aplicación Móvil
- **Android**: Plataforma principal para el desarrollo de la aplicación móvil nativa.
- **Apache Cordova**: Framework que permite el desarrollo de aplicaciones multiplataforma utilizando tecnologías web estándar como HTML, CSS y JavaScript.

### Desarrollo de la API
- **PHP o Python**: Lenguajes de programación que se consideran para el desarrollo de la API propia. La elección dependerá de factores como la eficiencia, la facilidad de integración y la seguridad.
- **PostgreSQL**: Sistema de gestión de bases de datos relacional que utilizaremos para almacenar información de usuarios y roles.

## Funcionalidades de la Aplicación

1. **Autenticación y Gestión de Sesiones**
   - Registro de nuevos usuarios.
   - Inicio de sesión seguro mediante autenticación basada en tokens.
   - Gestión de sesiones para mantener la seguridad y la integridad de los datos.

2. **Roles y Permisos**
   - Asignación de roles de usuario (administrador y cliente).
   - Control de acceso basado en roles para asegurar que los usuarios sólo puedan acceder a los recursos permitidos.

3. **Gestión de Servidores y Máquinas Virtuales**
   - Visualización de todos los servidores y máquinas virtuales para administradores.
   - Visualización limitada a las máquinas virtuales propias para clientes.
   - Acciones básicas como iniciar, detener, reiniciar y eliminar máquinas virtuales.
   - Monitoreo del rendimiento y estado de las máquinas virtuales.

4. **Interfaz de Usuario Intuitiva**
   - Diseño de una interfaz amigable y fácil de navegar.
   - Uso de gráficos y tablas para representar el estado y el rendimiento de los recursos de manera visual.

## Arquitectura del Proyecto

### Frontend (Aplicación Móvil)
- Desarrollado en Android y Apache Cordova.
- Comunicación con la API de Proxmox y nuestra API propia a través de peticiones HTTP/HTTPS.

### Backend (API Propia)
- Desarrollado en PHP o Python.
- Manejo de autenticación, gestión de usuarios y roles.
- Interacción con la base de datos PostgreSQL.

### Base de Datos
- **PostgreSQL**: Utilizada para almacenar datos persistentes de usuarios, roles y configuraciones de la aplicación.

## Futuras Mejoras y Extensiones

- **Notificaciones Push**: Implementación de notificaciones para alertar a los usuarios sobre eventos importantes en sus máquinas virtuales.
- **Soporte Multiplataforma**: Ampliar la compatibilidad de la aplicación a otras plataformas móviles como iOS.
- **Integración con Herramientas de Monitoreo**: Añadir funcionalidades para integrar con herramientas de monitoreo y alertas, mejorando la gestión y la respuesta ante incidentes.
- **Escalabilidad**: Optimización del backend para manejar una gran cantidad de usuarios y máquinas virtuales sin comprometer el rendimiento.

## Conclusión

Este proyecto tiene como objetivo proporcionar una solución completa y accesible para la gestión de servidores Proxmox a través de una aplicación móvil. Al integrar diversas tecnologías y adoptar un enfoque centrado en el usuario, buscamos ofrecer una herramienta potente y flexible que satisfaga las necesidades tanto de administradores como de clientes. Esperamos que esta iniciativa impulse la eficiencia en la gestión de infraestructuras virtuales y brinde una experiencia mejorada a todos los usuarios.

## Creadores

- **Daniel Gamero Delgado**
- **Raul Lopez Zurita**

---

¡Gracias por tu interés en nuestro proyecto! Estamos entusiasmados por llevar esta idea a la realidad y esperamos contar con tu apoyo y feedback durante todo el proceso de desarrollo.
