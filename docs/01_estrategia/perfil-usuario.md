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

### Buyer Persona — Marcela Rodríguez

> Persona derivada de la investigación primaria (encuesta a 23 docentes + 3 entrevistas en profundidad). Referencia completa en el documento académico del proyecto.

| Atributo | Valor |
|----------|-------|
| **Nombre** | Marcela Rodríguez |
| **Edad** | 34 años |
| **Cargo** | Docente de primaria, jornada única |
| **Institución** | Colegio público, municipio de Cundinamarca |
| **Experiencia** | 8 años frente a grupo |
| **Grupos a cargo** | 4 grupos · ~35 estudiantes c/u |
| **Dispositivo principal** | Smartphone Android Samsung Galaxy A14 |
| **Dispositivo secundario** | Portátil Windows de la institución (compartido) |
| **Conexión** | WiFi escolar intermitente + plan de datos limitado |
| **Nivel digital** | Básico-intermedio — WhatsApp, Google Forms, YouTube |
| **Relación con IA** | No ha usado herramientas de IA generativa antes de TIZA |

**Motivaciones:**
- Reducir el tiempo que dedica a papeleo y formatos institucionales
- Tener sus registros disponibles desde el celular sin depender del portátil
- Generar planeaciones de clase en menos tiempo sin sacrificar calidad pedagógica
- No perder datos cuando no hay internet en el salón

**Frustraciones:**
- *"Gasto más tiempo llenando formatos que preparando mis clases"*
- *"Pierdo mis registros cuando se daña el computador del colegio"*
- *"La plataforma institucional no funciona desde el celular"*
- *"Tengo que escribir los mismos datos en tres formatos distintos"*

**Escenario de uso:**
> Marcela llega al colegio a las 7:40 am. Abre TIZA en su Samsung A14, registra la asistencia de 35 estudiantes en 45 segundos mientras los niños sacan sus cuadernos. En el descanso, describe el tema de la próxima clase y obtiene tres propuestas de planeación generadas por IA; selecciona una, la ajusta y la guarda. El viernes exporta el informe del bimestre en PDF sin buscar ningún archivo de Excel.

---

### Datos demográficos del segmento

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