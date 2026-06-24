
function fakeRequest(data) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 1000);
  });
}

// Creación de los Items en el LocalStorage
// Logica para crear los items en el LocalStorage si no existen, con un array vacio como valor inicial
if (!localStorage.getItem('Persona')) {
    localStorage.setItem('Persona', JSON.stringify([]))
};

if (!localStorage.getItem('Persona_Fisica')) {
    localStorage.setItem('Persona_Fisica', JSON.stringify([]))
};

if (!localStorage.getItem('Usuario')) {
    localStorage.setItem('Usuario', JSON.stringify([]))
};

if (!localStorage.getItem('Usuario_Rol')) {
    localStorage.setItem('Usuario_Rol', JSON.stringify([]))
}

const Roles = [
    { id_rol: 1, nombre_rol: 'participante' },
    { id_rol: 2, nombre_rol: 'organizador' }
];

if (!localStorage.getItem('Rol')) {
    localStorage.setItem('Rol', JSON.stringify(Roles));
}

const formularioRegistro = document.getElementById('form-registro');
const checkboxTerminos = document.getElementById('terms-checkbox');
const submitButton = document.getElementById('submit-btn');

// fecha de registro formateada
// Formato argentino estándar (fecha y hora de 24hs)
const formateador = new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short', // '20/06/2026'
    timeStyle: 'medium' // '21:52:25'
});


// Mensajes de error y éxito para el usuario

// Submit
const submitErrorMensaje = document.getElementById('submit-error-msg');
const submitExitoMensaje = document.getElementById('submit-success-msg');

// Contraseña
const registroError = document.getElementById('registro-error-msg');
const registroExito = document.getElementById('registro-success-msg');

// loading msj

const submitLoadingMensaje = document.getElementById('submit-loading-msg');

checkboxTerminos?.addEventListener('change', () => {
    verificarCheckbox(checkboxTerminos, submitButton);
});

submitButton?.addEventListener('click', () => {
    if (!checkboxTerminos.checked) {
        
        submitErrorMensaje.textContent = 'Debe aceptar los términos y condiciones para finalizar el registro';
    }
    verificarCheckbox(checkboxTerminos, submitButton);
});

formularioRegistro?.addEventListener('submit', (e) => {
    e.preventDefault();
    registrarUsuario(formularioRegistro);
});




async function registrarUsuario(formularioRegistro) {
    try {

                // Validaciones
        validarCamposVacios()
        validarEmail(formularioRegistro.email.value)
        validarEmailExistente(formularioRegistro.email.value)
        validarContraseña(formularioRegistro.password.value)
        confirmarContraseña()
        validarFechaNacimiento(new Date(formularioRegistro.fecha_nacimiento.value))

        // Mostrar mensaje de "Cargando..."
        submitLoadingMensaje.style.color = "blue";
        submitLoadingMensaje.textContent = 'Procesando registro... Cargando...';
        submitButton.disabled = true; // desactiva el botón 

        // Simular la petición asíncrona (espera 1 segundo)
        const datosSimulados = { email: formularioRegistro.email.value };
        await fakeRequest(datosSimulados);


        // Creacion del usuario a partir del formulario
        const nuevaPersona = crearPersona(formularioRegistro);
        const nuevaPersonaFisica = crearPersonaFisica(formularioRegistro, nuevaPersona);
        const nuevoUsuario = crearUsuario(formularioRegistro, nuevaPersonaFisica);
        const nuevoUsuarioRol = crearUsuarioRol(nuevoUsuario);

        // Almacenamiento en localStorage
        guardarEnLocalStorage('Persona', nuevaPersona);
        guardarEnLocalStorage('Persona_Fisica', nuevaPersonaFisica);
        guardarEnLocalStorage('Usuario', nuevoUsuario);
        guardarEnLocalStorage('Usuario_Rol', nuevoUsuarioRol);

        // Mensaje final
        submitLoadingMensaje.textContent = '';
        submitErrorMensaje.textContent = '';
        registroExito.textContent = 'Registro exitoso';
        registroExito.style.color = 'green';

        // Reset del form
        formularioRegistro.reset();

    } catch (error) {
        registroError.textContent = error.message; // Mostrará 'Email ya existe'
        registroError.style.color = 'red';
    } finally {
        submitLoadingMensaje.textContent = '';
        submitButton.disabled = false; // Habilita el botón después de intentar el registro
    }   

}


// Funciones para crear los objetos a guardar en el LocalStorage, 
// separando cada una por su respectiva entidad (Persona, Persona_Fisica, Usuario, Usuario_Rol) 
// y relacionando los IDs correspondientes para mantener la integridad referencial entre las entidades.
const crearPersona = (formularioRegistro) => {
    const nuevaPersona = {
        id_persona: Date.now(),
        fecha_registro: formateador.format(new Date())
    };
    return nuevaPersona;
}


const crearPersonaFisica = (formularioRegistro, nuevaPersona) => {

    const nuevaPersonaFisica = {
        id_persona_fisica: nuevaPersona.id_persona, // Relación directa con Persona 
        nombre: formularioRegistro.nombre.value,
        apellido: formularioRegistro.apellido.value,
        fecha_nacimiento: formularioRegistro.fecha_nacimiento.value,
        dni: formularioRegistro.dni.value
    };
    return nuevaPersonaFisica;
}


const crearUsuario = (formularioRegistro, nuevaPersonaFisica) => {
    const nuevoUsuario = {
        id_usuario: Date.now() + 1, // Suma 1 para asegurar un ID único diferente al de Persona para Usuario
        fk_id_persona_fisica: nuevaPersonaFisica.id_persona_fisica, // Relación directa con Persona Física
        nickname: formularioRegistro.nickname.value,
        password: formularioRegistro.password.value,
        email: formularioRegistro.email.value,
        estado: "ACTIVO",
        fecha_baja: null
    };
        
    return nuevoUsuario;
}


const crearUsuarioRol = (nuevoUsuario) => {

    const rolSeleccionado = formularioRegistro.rol.value;
    const rol = Roles.find(r => r.nombre_rol === rolSeleccionado);

    const nuevoUsuarioRol = {
        fk_id_usuario: nuevoUsuario.id_usuario,
        fk_id_rol: rol.id_rol
    };  
    return nuevoUsuarioRol;
}


const guardarEnLocalStorage = (clave, valor) => {
    const datosExistentes = JSON.parse(localStorage.getItem(clave)) || [];
    datosExistentes.push(valor);
    localStorage.setItem(clave, JSON.stringify(datosExistentes));
}

const confirmarContraseña = () => {
    const password = formularioRegistro.password.value;
    const confirmPassword = formularioRegistro.confirm_password.value;
    if (password !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
        
    }   
    return true;
}


const verificarCheckbox = (checkbox, submitButton) => {
    if (checkbox.checked) { 
        submitErrorMensaje.textContent = '';
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }       
}


// validaciones:

const validarEmailExistente = (email) =>{

    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find(u => u.email === email )

    if (usuario) {
        throw new Error("Email ya existe");
    }

    registroError.textContent = '';
    return true

}


const validarCamposVacios = () => {

    // 1. Captura todos los datos automáticamente
    const datosFormulario = new FormData(formularioRegistro);

    // 2. Lo convierte en un objeto común de JavaScript { name: value }
    const objetoDatos = Object.fromEntries(datosFormulario);

    for (const [key, value] of Object.entries(objetoDatos)) {
        if (!value.trim()) { // Verifica si el valor está vacío o solo tiene espacios
            throw new Error("Todos los campos son obligatorios");
        }
    }
    submitErrorMensaje.textContent = '';
    return true;
}



const validarEmail = (email) => {
    
    // Recorrer cada carácter del email para verificar si contiene '@'
    for (const char of email) {
        if (char === '@') {
            registroError.textContent = '';
            return true;
        }
    }
    throw new Error('Email inválido, debe contener "@"');
}


const validarContraseña = (password) => {

    if (password.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres");
    }
    
    let contador = 0;

    for (const char of password) {
        if (char === ' ') {
            throw new Error("La contraseña no debe contener espacios o vacíos");
        }

        if ('0123456789'.includes(char)) {
            contador++;
        }
    }

    if (contador === 0) {
        throw new Error("La contraseña debe contener al menos un número");
    }

    registroError.textContent = '';
    return true;
}

const validarFechaNacimiento = (fecha) => {
    const fechaActual = new Date();

    console.log('Fecha de nacimiento:', fecha);
    console.log('Fecha actual:', fechaActual);

    let edad = fechaActual.getFullYear() - fecha.getFullYear();

    console.log('Edad:', edad);
    const mes = fechaActual.getMonth() - fecha.getMonth();
    if (mes < 0 || (mes === 0 && fechaActual.getDate() < fecha.getDate())) {
        edad--;
    }

    if (edad < 18) {
        throw new Error("Debes ser mayor de 18 años para registrarte");
    }

    registroError.textContent = '';
    return true;


}


// LOGIN logica

// Formulario de Login
const formularioLogin = document.getElementById('form-login');


// Mensajes de error y éxito para el login

const loginErrorMensaje = document.getElementById('login-error-msg');
const loginExitoMensaje = document.getElementById('login-success-msg');

const loginLoadingMensaje = document.getElementById('login-loading-msg');
        

const btnLogin = document.getElementById('login-btn');

formularioLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = formularioLogin.email.value;
    const password = formularioLogin.password.value;

    try {

        loginLoadingMensaje.style.color = "blue";
        loginLoadingMensaje.textContent = 'Iniciando sesión... Cargando...';
        btnLogin.disabled = true; // desactiva el botón de login durante la simulación

        const datosSimulados = { email, password };
        await fakeRequest(datosSimulados);

        const usuarios = obtenerUsuarios();
        const usuario = usuarios.find(u => u.email === email);

        if (!usuario || usuario.password !== password) {
            loginExitoMensaje.textContent = '';
            throw new Error("Usuario o contraseña incorrectos");
        }

        // Login correcto
        loginErrorMensaje.textContent = '';
        loginLoadingMensaje.textContent = '';
        loginExitoMensaje.textContent = "Login exitoso";
        loginExitoMensaje.style.color = "green";

        formularioLogin.reset();

    } catch (error) {
        console.error('Error durante el login:', error);
        loginErrorMensaje.textContent = error.message; 
        loginErrorMensaje.style.color = 'red';
    } finally {
        loginLoadingMensaje.textContent = '';
        btnLogin.disabled = false; // activa el botón de login después de la simulación
    }
});

// Obtiene los usuarios guardados o devuelve un array vacío
function obtenerUsuarios() {
    const data = localStorage.getItem("Usuario");
    // Si hay datos, los convierte de string a objeto
    // Si no hay nada, devuelve array vacío
    return data ? JSON.parse(data) : [];
}