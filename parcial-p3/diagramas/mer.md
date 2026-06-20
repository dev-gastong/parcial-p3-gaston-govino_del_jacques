```mermaid
    erDiagram
        Persona ||--|| Persona_fisica : "es una"
        Persona_fisica ||--|| Usuario : "tiene"


        Usuario ||--|{ Usuario_Rol : "posee"

        Usuario_Rol }|--|| Rol : "asigna"

        Persona {
            int id_persona PK
            dateTime fecha_registro
        }

        Persona_fisica {
            int id_persona_fisica PK,FK
            string nombre
            string apellido
            dateTime fecha_nacimiento
            string DNI
        }

        Usuario {
            int id_usuario PK
            int persona_fisica_id FK
            string nickname
            string password
            string email
            boolean estado
            dateTime fecha_baja 
        }

        Usuario_Rol{
            int id_usuario FK
            int id_rol FK
        }

        Rol {
            int id PK
            string nombre_rol
        }