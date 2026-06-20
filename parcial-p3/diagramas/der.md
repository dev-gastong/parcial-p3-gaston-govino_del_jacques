```mermaid

    graph LR
    %% Entidades
    Persona[Persona]
    PersonaFisica[Persona_fisica]
    Usuario[Usuario]
    Rol[Rol]
    

    %% Relaciones 
    R1{es}
    R2{tiene}
    R3{posee}

    %% Conexiones
    Persona --- |1| R1
    R1 --- |1| PersonaFisica
    
    PersonaFisica --- |1| R2
    R2 --- |1| Usuario
    
    Usuario --- |N| R3
    R3 --- |M| Rol

    %% Estilos
    classDef entidad fill:#AEC6CF, color:#000000;

    class Persona,PersonaFisica,Usuario,Rol entidad;
