```mermaid
graph TD
    %% Puntos de Control de Extremos
    INICIO([INICIO: Enviar Formulario Login]) --> P1_1[1.2.1: Validar Formatos en Frontend]
    
    %% Almacenes de Datos (Simulados en LocalStorage)
    subgraph LocalStorage
        D2[(Usuario)]
        D3[(Usuario_Rol)]
    end

    %% 1. VALIDACIÓN DE FORMATOS DE TEXTO
    P1_1 --> C1{¿Campos Válidos?<br><font size=2>- Email con formato válido<br>- Contraseña no vacía</font>}
    C1 -->|No| Return_Err1([Mostrar Errores en el DOM])
    C1 -->|Sí| P1_2[1.2.2: Iniciar Proceso Asíncrono fakeRequest]

    %% 2. ASINCRONÍA (Consigna)
    P1_2 -->|1. Mostrar 'Cargando...' en DOM| P1_3[1.2.3: Ejecutar fakeRequest con Async/Await]
    P1_3 -->|2. Simular Espera 1s| P1_4[1.2.4: Verificar Existencia del Usuario]

    %% 3. CONTROL DE EXISTENCIA DE CUENTA
    P1_4 -->|Buscar por Email| D2
    D2 -->|Retornar Registro de Usuario| P1_4
    P1_4 --> C2{¿El Usuario Existe?}
    C2 -->|No| Return_Err2([Mostrar en DOM: Credenciales Incorrectas])

    %% 4. COMPROBACIÓN DE CONTRASEÑA (Hasheada)
    C2 -->|Sí| P1_5[1.2.5: Validar Contraseña]
    P1_5 --> C3{¿Contraseña<br>Coincide?}
    C3 -->|No| Return_Err2

    %% 5. LOGIN EXITOSO
    C3 -->|Sí| Success([Ocultar 'Cargando...' y Mostrar: Login Exitoso])

    %% Embudo de Salidas (Mensajes en el DOM, sin alertas)
    Return_Err1 --> FIN([FIN])
    Return_Err2 --> FIN
    Success --> FIN
