# Perfil de Usuario — TIZA

---

## Roles del sistema

TIZA define tres roles con permisos y flujos diferenciados:

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| `teacher` | Docente activo que planea, registra asistencia, notas e informes | Panel docente, planeación, asistencia, clases, estudiantes |
| `coordinator` | Coordinador académico que revisa y aprueba planeaciones | Panel de revisión de planeaciones de su institución |
| `admin` | Administrador de la plataforma (1 persona) | Gestión de instituciones y códigos de invitación |

---

## Perfil principal: Docente colombiano

### Datos demográficos

| Atributo | Rango / Valor típico |
|----------|---------------------|
| Edad | 28–55 años |
| Género | 60% femenino, 40% masculino (datos MEN Colombia) |
| Ubicación | Municipios de Colombia — urbano y rural |
| Nivel educativo | Licenciatura o Normalista Superior |
| Sector | Principalmente público (colegios oficiales) |
| Grupos a cargo | 3–6 grupos de 30–45 estudiantes c/u |
| Años de experiencia | 2–25 años |

### Perfil tecnológico

| Atributo | Descripción |
|----------|-------------|
| Dispositivo principal | Smartphone Android (gama media: Samsung A-series, Motorola G) |
| Dispositivo secundario | Portátil con Windows o Chromebook institucional |
| Conexión | WiFi institucional (intermitente) + datos móviles (límite de plan) |
| Apps habituales | WhatsApp, Google Forms, Excel, YouTube |
| Nivel digital | Básico-intermedio — usa apps cotidianas con fluidez, pero evita plataformas complejas |
| Relación con IA | Mayoría no ha usado herramientas de IA generativa antes de TIZA |

### Motivaciones

- Reducir el tiempo que dedica a papeleo y formatos
- Tener sus registros disponibles desde cualquier dispositivo
- Presentar informes institucionales rápidamente
- No depender de la conexión a internet en el salón de clase

### Frustraciones (Pain points)

- "Gasto más tiempo llenando formatos que preparando clases"
- "Pierdo mis registros cuando se daña el computador"
- "La plataforma del colegio es difícil y no funciona desde el celular"
- "Tengo que escribir los mismos datos en 3 formatos distintos"
- "A veces no hay internet en el colegio"

### Escenario típico de uso

> La profesora Valentina tiene clase de Ciencias Naturales con 5.° a las 8 am. Llega al colegio, abre TIZA en su celular, registra la asistencia de 32 estudiantes en 45 segundos mientras los estudiantes sacan sus cuadernos. En el descanso, genera el esquema de la próxima clase sobre "ecosistemas" en menos de un minuto. El viernes exporta el boletín del bimestre en PDF directamente desde la plataforma.

---

## Perfil secundario: Coordinador académico

| Atributo | Valor |
|----------|-------|
| Función | Revisión y aprobación de planeaciones docentes |
| Frecuencia de uso | 1–3 veces por semana |
| Acción principal | Revisar planeaciones pendientes, aprobar o solicitar ajustes con comentario |
| Dispositivo | Portátil / desktop |

---

## Perfil operativo: Administrador de plataforma

| Atributo | Valor |
|----------|-------|
| Función | Crear instituciones educativas y generar códigos de invitación |
| Frecuencia de uso | Eventual (onboarding de nuevas instituciones) |
| Acceso especial | Rol `admin` asignado directamente en BD, no accesible desde registro |

---

*TIZA · Perfil de Usuario · v1.0 · 2026*