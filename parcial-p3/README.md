# Parcial Programación 3: Módulo de Autenticación

## Descripción del Proyecto

Este proyecto consiste en un sistema de registro y autenticación de usuarios desarrollado con tecnologías web nativas (HTML, CSS y JavaScript). El sistema permite gestionar altas de usuarios y validaciones de acceso, implementando persistencia de datos mediante `localStorage`, manejo de eventos del DOM y simulación de peticiones asíncronas para mejorar la experiencia de usuario.

### Características Principales

* **Validaciones en tiempo real:** Verificación de campos obligatorios, formato de email, complejidad de contraseñas y edad mínima (18 años).
* **Persistencia:** Almacenamiento local de usuarios (Persona, Persona Física y Roles) para mantener la sesión.
* **Asincronía:** Implementación de `async/await` con `fakeRequest` para simular latencia de servidor.
* **Interfaz Dinámica:** Manipulación del DOM para mostrar estados de carga y mensajes de error sin recargar la página.

---

## Instrucciones para la ejecución

1. Descargar los archivos.
2. Vereificar tener todos los archivos en una misma carpeta.
3. Abre el archivo `index.html` en el navegador.
4. Probar el registro y el inicio de sesión.

### Usuario de prueba

Para verificar el funcionamiento sin crear uno nuevo desde cero: 

Email: 

    ejemplo@mail.com

Contraseña:

    password123

---

## Diagramas de Flujo

*A continuación se presentan los flujos lógicos descritos en texto*

### Proceso de Registro

1. Se dispara el evento Submit del formulario de Registro.
2. Se capturan los datos ingresados por el usuario.
3. Se realizan las validaciones correspondientes (Email, contraseña, mayoría de edad, etc.).
* **Si falla:** Se manipula el DOM para mostrar los mensajes de error correspondientes.
* **Si pasa:** Se muestra el estado de carga en la interfaz y se invoca a `fakeRequest` con `async/await`.


4. Una vez resuelta la promesa asíncrona, se guardan los datos en `localStorage` (estructurados en Persona, Persona Física y Roles) y se limpia el estado de carga.

### Proceso de Login

1. Se dispara el evento Submit del formulario de Login.
2. Se capturan el Email y la Contraseña.
3. Se ejecuta la función para obtener los usuarios guardados en el `localStorage`.
4. Se verifica si las credenciales coinciden con algún registro (o con el usuario de prueba).
* **Si no coinciden:** Se muestra un mensaje de error en el DOM.
* **Si coinciden:** Se simula el inicio de sesión exitoso y se actualiza la interfaz de usuario.



---

## Esquema del Código

El proyecto está modularizado para separar responsabilidades de la siguiente manera:

### app.js

* **Validaciones:** Funciones como `validarEmail`, `validarContraseña`, `validarFechaNacimiento`, etc.
* **Lógica de Registro:** La función `registrarUsuario()` coordina la captura de datos, la invocación de la API simulada y la persistencia.
* **Lógica de Login:** Verifica las credenciales comparando con  el `localStorage`.
* **Persistencia:** Funciones `guardarEnLocalStorage` y `obtenerUsuarios`.

### index.html

* **Estructura:** Organización de los formularios utilizando contenedores `div` para separar visual y lógicamente las secciones de Persona, Usuario y Roles. Section para indicar a nivel de accesibilidad de que trata el documento, y form para capturar todos los valores ingresados.

### styles.css

* **Diseño:** Usa Flexbox u una interfaz simple, con login-registro dual, es decir, en una misma pagina.
