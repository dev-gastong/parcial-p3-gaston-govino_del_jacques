```mermaid
graph TD
    %% Puntos de Control de Extremos
    INICIO([INICIO: Enviar Formulario Registro]) --> P1_1[1.1.1: Validar Campos Obligatorios y Formatos]
    
    %% Almacenes de Datos (Simulados en LocalStorage)
    subgraph LocalStorage
        D1[(Persona_Fisica)]
        D2[(Usuario)]
        D3[(Usuario_Rol)]
        D_Roles[(Tabla Maestro: Rol)]
    end

    %% 1. VALIDACIONES DE FRONTEND
    P1_1 --> C1{¿Campos Válidos?<br><font size=2>- Email c/ formato<br>- Mayor 18 años<br>- Contraseña >= 8 carac. + nº<br>- Confirmación coincide<br>- Términos aceptados</font>}
    C1 -->|No| Return_Err1([Mostrar Errores en el DOM])
    C1 -->|Sí| P1_2[1.1.2: Verificar Duplicados]

    %% 2. CONTROL DE EMAIL ÚNICO
    P1_2 -->|Buscar Email| D2
    D2 -->|Retornar si existe| P1_2
    P1_2 --> C2{¿Email ya<br>está registrado?}
    C2 -->|Sí| Return_Err2([Mostrar en DOM: Email duplicado])
    C2 -->|No| P1_3[1.1.3: Iniciar Proceso Asíncrono fakeRequest]

    %% 3. ASINCRONÍA 
    P1_3 -->|1. Mostrar 'Cargando...' en DOM| P1_4[1.1.4: Ejecutar fakeRequest con Async/Await]
    P1_4 -->|2. Simular Espera 1s| P1_5[1.1.5: Registrar Persona Física]

    %% 4. PERSISTENCIA EN LAS ENTIDADES
    P1_5 -->|Escribir: Nombre, Apellido, F. Nac, DNI| D1
    
    P1_5 -->|id_persona_fisica como FK| P1_6[1.1.6: Registrar Cuenta Usuario]
    P1_6 -->|Escribir: Nickname, Email, Password, Estado=True| D2
    
    %% 5. BIFURCACIÓN DEL ROL CONSULTANDO LA TABLA MAESTRO
    P1_6 --> C_Rol{¿El rol seleccionado<br>es 'Participante'?}
    
    C_Rol -->|Sí| P1_7A[1.1.7A: Buscar ID de Rol Participante]
    D_Roles -->|Consultar metadata| P1_7A
    P1_7A -->|Escribir Relación id_usuario + id_rol| D3
    
    C_Rol -->|No| P1_7B[1.1.7B: Buscar ID de Rol Organizador]
    D_Roles -->|Consultar metadata| P1_7B
    P1_7B -->|Escribir Relación id_usuario + id_rol| D3

    %% Fin del proceso
    P1_7A --> Success
    P1_7B --> Success
    Success([Ocultar 'Cargando...' y Mostrar: Registro Exitoso])

    %% Embudo de Salidas
    Return_Err1 --> FIN([FIN])
    Return_Err2 --> FIN
    Success --> FIN