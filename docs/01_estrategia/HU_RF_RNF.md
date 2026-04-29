# TIZA

**Plataforma de Gestión Docente con IA**

**Historias de Usuario · Requisitos Funcionales · Requisitos No Funcionales**

Capstone Design Project — 2025

ODS 4 · Educación de Calidad · Colombia

---
##link de vistas de la plataforma 
https://stitch.withgoogle.com/projects/14997593706248079378
## Historias de Usuario

Este documento recoge las 30 historias de usuario de Tiza, cubriendo cada acción que un docente realiza en la plataforma desde el registro hasta el uso diario. El actor en todas las historias es 'Docente', sin especificación de nivel educativo ni perfil tecnológico, para que la plataforma sirva a cualquier docente colombiano.

---

### Transversal — Autenticación y Cuenta

#### HU-01: Registrarse con correo electrónico y contraseña

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-01 — Registrarse con correo electrónico y contraseña |
| **Actor** | Docente |
| **Prioridad** | Alta |
| **Narrativa** | Como docente, quiero crear una cuenta en la plataforma con mi correo electrónico y una contraseña segura, para acceder a mis datos desde cualquier dispositivo. |
| **Criterios de aceptación** | El formulario solicita correo, contraseña y confirmación de contraseña. |
| | El sistema valida que el correo no esté registrado previamente. |
| | El sistema valida que la contraseña cumpla mínimo 8 caracteres. |
| | Se muestra confirmación de registro exitoso. |
| | El docente acepta la política de tratamiento de datos (Ley 1581 de 2012) de forma explícita antes de crear la cuenta. |

#### HU-02: Iniciar sesión de forma segura

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-02 — Iniciar sesión de forma segura |
| **Actor** | Docente |
| **Prioridad** | Alta |
| **Narrativa** | Como docente, quiero iniciar sesión con mi correo y contraseña para acceder a mis datos protegidos. |
| **Criterios de aceptación** | El docente ingresa correo y contraseña en la pantalla de inicio. |
| | La comunicación se realiza con cifrado TLS. |
| | Si las credenciales son incorrectas el sistema muestra un mensaje de error claro. |
| | La sesión se mantiene activa hasta que el docente cierre sesión manualmente. |
| | Tras 5 intentos fallidos consecutivos, el sistema bloquea el acceso durante 15 minutos. |

#### HU-03: Recuperar contraseña por correo electrónico

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-03 — Recuperar contraseña por correo electrónico |
| **Actor** | Docente |
| **Prioridad** | Alta |
| **Narrativa** | Como docente, quiero recuperar mi contraseña si la olvido, para no perder el acceso a mis datos. |
| **Criterios de aceptación** | El docente ingresa su correo en la pantalla de recuperación. |
| | El sistema envía un correo con un enlace de recuperación válido por 30 minutos. |
| | El enlace permite al docente establecer una nueva contraseña. |
| | Una vez usado el enlace, queda inválido. |
| | El docente recibe confirmación de que la contraseña fue cambiada. |

#### HU-04: Cerrar sesión

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-04 — Cerrar sesión |
| **Actor** | Docente |
| **Prioridad** | Media |
| **Narrativa** | Como docente, quiero cerrar sesión desde cualquier dispositivo para proteger mi información cuando termine de usar la plataforma. |
| **Criterios de aceptación** | El docente puede cerrar sesión desde cualquier pantalla mediante un botón visible. |
| | Al cerrar sesión, la sesión queda invalidada en el servidor. |
| | El sistema redirige al docente a la pantalla de inicio de sesión. |
| | El docente no puede acceder a sus datos sin volver a autenticarse. |

#### HU-05: Usar la plataforma desde cualquier dispositivo sin instalación

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-05 — Usar la plataforma desde cualquier dispositivo sin instalación |
| **Actor** | Docente |
| **Prioridad** | Alta |
| **Narrativa** | Como docente, quiero usar la plataforma desde el navegador de mi celular, tablet o computador sin instalar nada, para empezar a usarla desde el primer día. |
| **Criterios de aceptación** | La plataforma funciona en Chrome, Safari y Firefox sin instalación ni extensiones. |
| | El diseño es responsivo y se adapta a celular (320px), tablet (768px) y computador (1280px+). |
| | La interfaz sigue el principio de una acción principal por pantalla. |
| | Un docente puede completar su primer registro de asistencia en menos de 2 minutos sin ayuda. |

---

### Onboarding — Configuración Inicial de Clases

#### HU-06: Crear una clase

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-06 — Crear una clase |
| **Actor** | Docente |
| **Prioridad** | Alta |
| **Narrativa** | Como docente, quiero crear una clase indicando su nombre, nivel educativo, asignatura, área y período académico, para que el sistema organice mis registros y planeaciones bajo esa clase. |
| **Criterios de aceptación** | El formulario solicita: nombre de la clase, nivel (primaria/secundaria/técnico/universitario), asignatura, área y período académico. |
| | La clase creada aparece disponible en todos los módulos (registro, planeación, informes, panel). |
| | El docente puede crear múltiples clases. |
| | Se muestra confirmación de creación exitosa. |

#### HU-07: Cargar lista de estudiantes desde archivo Excel o CSV

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-07 — Cargar lista de estudiantes desde archivo Excel o CSV |
| **Actor** | Docente |
| **Prioridad** | Alta |
| **Narrativa** | Como docente, quiero subir un archivo Excel o CSV con los nombres de mis estudiantes para que el sistema importe la lista automáticamente sin necesidad de digitar cada nombre. |
| **Criterios de aceptación** | El sistema acepta archivos .xlsx y .csv. |
| | Antes de confirmar, el sistema muestra una previsualización de los datos detectados con número de estudiantes encontrados. |
| | El sistema indica errores de formato con número de fila y descripción del error. |
| | Tras confirmar, la lista queda precargada en la clase y disponible para registro de asistencia. |
| | El docente puede cancelar la importación desde la previsualización. |

#### HU-08: Configurar escala y categorías de calificación

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-08 — Configurar escala y categorías de calificación |
| **Actor** | Docente |
| **Prioridad** | Alta |
| **Narrativa** | Como docente, quiero configurar la nota mínima, máxima y los tipos de evaluación con sus pesos porcentuales, para que el sistema calcule los promedios según el esquema que uso. |
| **Criterios de aceptación** | El docente define nota mínima y máxima (ej. 0–5, 0–10, 0–100). |
| | El docente crea tipos de evaluación (ej. actividad, parcial, examen) con su peso porcentual. |
| | El sistema valida que la suma de pesos sea exactamente 100% antes de guardar. |
| | Si la suma no es 100%, muestra un aviso indicando la diferencia y no permite guardar. |
| | La escala queda vinculada a la clase y disponible para cálculo automático de promedios. |

#### HU-09: Editar los datos de una clase

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-09 — Editar los datos de una clase |
| **Actor** | Docente |
| **Prioridad** | Media |
| **Narrativa** | Como docente, quiero editar el nombre, nivel, área o período de una clase ya creada, para corregir errores o actualizar la información sin tener que crearla de nuevo. |
| **Criterios de aceptación** | El docente accede a la opción de editar desde la vista de la clase. |
| | Puede modificar nombre, nivel, asignatura, área y período. |
| | Los cambios se guardan y se reflejan en todos los módulos. |
| | El sistema muestra confirmación de guardado exitoso. |

#### HU-10: Agregar o editar un estudiante individualmente

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-10 — Agregar o editar un estudiante individualmente |
| **Actor** | Docente |
| **Prioridad** | Media |
| **Narrativa** | Como docente, quiero agregar un estudiante nuevo o editar los datos de uno existente, para mantener la lista actualizada cuando hay cambios después de la carga inicial. |
| **Criterios de aceptación** | El docente puede agregar un estudiante ingresando su nombre manualmente. |
| | El docente puede editar el nombre de un estudiante existente. |
| | Los cambios se reflejan de inmediato en el módulo de asistencia y notas. |
| | El sistema muestra confirmación de la acción realizada. |

#### HU-11: Archivar una clase al finalizar el período

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-11 — Archivar una clase al finalizar el período |
| **Actor** | Docente |
| **Prioridad** | Media |
| **Narrativa** | Como docente, quiero archivar una clase cuando termina el período para que deje de aparecer en mi panel activo pero siga accesible en el historial. |
| **Criterios de aceptación** | El docente puede archivar una clase desde su vista detallada. |
| | Las clases archivadas desaparecen del panel principal pero son accesibles desde una sección de archivo. |
| | Todos los registros, notas e informes de la clase archivada se conservan íntegros. |
| | El docente puede desarchivar una clase si lo necesita. |

---

### Módulo 1 — Asistente de Planeación de Clases

#### HU-12: Explorar biblioteca de objetivos curriculares

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-12 — Explorar biblioteca de objetivos curriculares |
| **Actor** | Docente |
| **Prioridad** | Alta |
| **Narrativa** | Como docente, quiero explorar una biblioteca de objetivos curriculares organizados por área, grado y período, para seleccionar el objetivo de mi clase antes de generar el esquema de planeación. |
| **Criterios de aceptación** | La biblioteca organiza los objetivos por área, grado y período académico. |
| | El docente puede buscar objetivos por palabra clave o tema. |
| | Cada objetivo muestra su descripción completa antes de ser seleccionado. |
| | Al seleccionar un objetivo, el sistema lo usa como entrada para generar el esquema de planeación. |

#### HU-13: Generar esquema de planeación con IA

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-13 — Generar esquema de planeación con IA |
| **Actor** | Docente |
| **Prioridad** | Alta |
| **Narrativa** | Como docente, quiero que la IA genere un esquema de planeación de clase a partir del objetivo curricular que seleccioné, incluyendo actividades sugeridas, recursos, criterios de evaluación y tiempo estimado. |
| **Criterios de aceptación** | Al seleccionar un objetivo, el sistema genera un esquema con: actividades, recursos, criterios de evaluación y tiempo estimado. |
| | La generación tarda menos de 30 segundos. |
| | El esquema generado se muestra completo antes de que el docente lo edite o guarde. |
| | Si la generación falla, el sistema muestra un mensaje de error claro con opción de reintentar. |

#### HU-14: Editar y guardar un esquema de planeación

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-14 — Editar y guardar un esquema de planeación |
| **Actor** | Docente |
| **Prioridad** | Alta |
| **Narrativa** | Como docente, quiero editar cualquier sección del esquema generado y guardarlo, para adaptar la planeación a mi grupo y contexto manteniendo el control total del contenido. |
| **Criterios de aceptación** | El docente puede modificar actividades, recursos, criterios de evaluación y tiempo estimado. |
| | El sistema guarda los cambios automáticamente al salir o mediante botón explícito. |
| | El docente puede descartar cambios y volver al borrador original generado por la IA. |
| | El sistema muestra confirmación de guardado exitoso. |

#### HU-15: Reutilizar y duplicar planeaciones anteriores

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-15 — Reutilizar y duplicar planeaciones anteriores |
| **Actor** | Docente |
| **Prioridad** | Media |
| **Narrativa** | Como docente, quiero acceder al repositorio de mis planeaciones anteriores organizadas por período, para duplicarlas y editarlas sin tener que planear desde cero cada semestre. |
| **Criterios de aceptación** | El repositorio muestra todas las planeaciones del docente organizadas por período, área y grado. |
| | El docente puede buscar planeaciones por palabra clave o tema. |
| | El docente puede duplicar cualquier planeación y editarla como nueva. |
| | Las planeaciones duplicadas no afectan a las originales. |

#### HU-16: Exportar planeación en formato descargable

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-16 — Exportar planeación en formato descargable |
| **Actor** | Docente |
| **Prioridad** | Media |
| **Narrativa** | Como docente, quiero exportar mi planeación en PDF o Word para poder compartirla, archivarla o entregarla sin transcribir la información manualmente. |
| **Criterios de aceptación** | El docente puede elegir entre exportar en PDF o Word. |
| | La exportación incluye todos los campos: objetivo, actividades, recursos, criterios de evaluación y tiempo. |
| | El archivo se genera en menos de 30 segundos. |
| | El archivo descargado no requiere edición adicional para ser usado. |

---

### Módulo 2 — Registro de Asistencia y Notas

#### HU-17: Registrar asistencia con un toque por estudiante

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-17 — Registrar asistencia con un toque por estudiante |
| **Actor** | Docente |
| **Prioridad** | Alta |
| **Narrativa** | Como docente, quiero marcar la asistencia de mis estudiantes con un solo toque por estudiante desde una lista precargada, para completar el registro en segundos sin digitar nombres. |
| **Criterios de aceptación** | La lista del grupo aparece precargada con todos los estudiantes de la clase. |
| | El docente marca presencia o ausencia con un solo toque por estudiante. |
| | El registro se guarda automáticamente sin botón de confirmación adicional. |
| | El sistema registra fecha y hora del registro de asistencia. |
| | Funciona desde celular, tablet y computador sin instalación. |

#### HU-18: Editar un registro de asistencia ya guardado

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-18 — Editar un registro de asistencia ya guardado |
| **Actor** | Docente |
| **Prioridad** | Media |
| **Narrativa** | Como docente, quiero corregir un registro de asistencia que guardé con un error, para mantener la información precisa sin tener que volver a registrar todo el grupo. |
| **Criterios de aceptación** | El docente puede acceder a registros de asistencia de cualquier fecha pasada. |
| | El docente puede cambiar el estado (presente/ausente) de un estudiante en un registro ya guardado. |
| | El sistema guarda la corrección con la fecha de modificación. |
| | Se muestra confirmación de la corrección guardada. |

#### HU-19: Registrar notas con cálculo automático de promedios

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-19 — Registrar notas con cálculo automático de promedios |
| **Actor** | Docente |
| **Prioridad** | Alta |
| **Narrativa** | Como docente, quiero ingresar las notas de mis estudiantes por actividad, parcial o evaluación, y que el sistema calcule automáticamente los promedios ponderados según la escala configurada. |
| **Criterios de aceptación** | El docente selecciona el tipo de evaluación (según las categorías configuradas en HU-08) e ingresa las notas por estudiante. |
| | El sistema calcula automáticamente el promedio ponderado al ingresar cada nota. |
| | Las notas se guardan instantáneamente y quedan disponibles en el historial. |
| | El sistema muestra el promedio acumulado del período por estudiante. |

#### HU-20: Editar una nota ya registrada

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-20 — Editar una nota ya registrada |
| **Actor** | Docente |
| **Prioridad** | Media |
| **Narrativa** | Como docente, quiero corregir una nota que ingresé con un error, para mantener los registros académicos precisos. |
| **Criterios de aceptación** | El docente puede acceder a notas de cualquier evaluación pasada. |
| | El docente puede modificar la nota de un estudiante en una evaluación ya registrada. |
| | Al modificar la nota, el sistema recalcula automáticamente el promedio del estudiante. |
| | El sistema guarda la corrección con la fecha de modificación y muestra confirmación. |

#### HU-21: Consultar historial completo de registros

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-21 — Consultar historial completo de registros |
| **Actor** | Docente |
| **Prioridad** | Media |
| **Narrativa** | Como docente, quiero acceder al historial de asistencia y notas de cualquier grupo en cualquier momento, para no depender de cuadernos ni planillas en papel. |
| **Criterios de aceptación** | El historial muestra todos los registros de asistencia y notas por grupo y período. |
| | Se puede filtrar por estudiante, fecha o tipo de evaluación. |
| | Los datos están disponibles desde cualquier dispositivo con navegador. |
| | El sistema no pierde datos entre sesiones. |

#### HU-22: Trabajar sin conexión a internet (modo offline)

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-22 — Trabajar sin conexión a internet (modo offline) |
| **Actor** | Docente |
| **Prioridad** | Alta |
| **Narrativa** | Como docente, quiero que los registros de asistencia y notas se guarden localmente cuando no hay internet y se sincronicen automáticamente al recuperar señal, para no perder información ni depender de la conectividad. |
| **Criterios de aceptación** | El sistema permite registrar asistencia y notas sin conexión a internet. |
| | Los datos se almacenan localmente en el dispositivo. |
| | Al recuperar conexión, los datos se sincronizan automáticamente con el servidor. |
| | No se pierde ningún registro durante la sincronización. |
| | El docente recibe confirmación visual cuando la sincronización se completa exitosamente. |

---

### Módulo 3 — Generación de Informes y Evidencias

#### HU-23: Generar informe de desempeño automáticamente en PDF

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-23 — Generar informe de desempeño automáticamente en PDF |
| **Actor** | Docente |
| **Prioridad** | Alta |
| **Narrativa** | Como docente, quiero que el sistema genere automáticamente mis informes de desempeño en PDF a partir de los registros ya capturados, para no tener que digitar la misma información en múltiples formatos. |
| **Criterios de aceptación** | El sistema genera el informe en PDF con: datos del estudiante, asistencia, notas por actividad y promedio final. |
| | El docente puede seleccionar el período del informe (bimestral, trimestral, final). |
| | La generación toma menos de 30 segundos por grupo. |
| | El sistema muestra una vista previa completa antes de que el docente descargue o apruebe. |

#### HU-24: Obtener borrador de comentarios cualitativos con IA

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-24 — Obtener borrador de comentarios cualitativos con IA |
| **Actor** | Docente |
| **Prioridad** | Alta |
| **Narrativa** | Como docente, quiero que la IA genere un borrador de comentario cualitativo por cada estudiante basado en sus datos cuantitativos, para revisarlo y ajustarlo en minutos en lugar de redactar cada comentario desde cero. |
| **Criterios de aceptación** | La IA genera un borrador de comentario diferenciado por estudiante basado en sus notas y asistencia. |
| | El comentario no es genérico: refleja el desempeño real del estudiante. |
| | El docente puede editar, aprobar o regenerar cada comentario individualmente. |
| | Los comentarios mantienen un tono profesional y constructivo. |
| | La generación de comentarios para un grupo completo toma menos de 45 segundos. |

#### HU-25: Revisar y aprobar el informe antes de descargarlo

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-25 — Revisar y aprobar el informe antes de descargarlo |
| **Actor** | Docente |
| **Prioridad** | Alta |
| **Narrativa** | Como docente, quiero revisar el borrador completo del informe generado, editar cualquier campo y aprobarlo antes de descargarlo, para garantizar que el documento final refleja mi criterio profesional. |
| **Criterios de aceptación** | El sistema presenta la vista previa completa del informe antes de cualquier descarga. |
| | El docente puede editar cualquier campo del borrador: notas, comentarios, datos del estudiante. |
| | El informe solo se descarga cuando el docente lo aprueba explícitamente. |
| | Los cambios manuales del docente se conservan si regenera el borrador de IA. |

#### HU-26: Adjuntar evidencias al informe

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-26 — Adjuntar evidencias al informe |
| **Actor** | Docente |
| **Prioridad** | Media |
| **Narrativa** | Como docente, quiero adjuntar fotos, archivos o documentos directamente al informe de cada período, para que las evidencias queden organizadas y vinculadas al registro sin carpetas físicas ni correos sueltos. |
| **Criterios de aceptación** | El docente puede adjuntar uno o más archivos (foto, PDF, documento) a un informe. |
| | Los formatos aceptados son: JPG, PNG, PDF y DOCX. Tamaño máximo: 10 MB por archivo. |
| | Los archivos adjuntos quedan vinculados al informe y período correspondiente. |
| | El informe descargado incluye referencia a las evidencias adjuntas. |

#### HU-27: Exportar informe aprobado en PDF o Word

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-27 — Exportar informe aprobado en PDF o Word |
| **Actor** | Docente |
| **Prioridad** | Alta |
| **Narrativa** | Como docente, quiero descargar el informe aprobado en PDF o Word para poder usarlo como necesite: imprimirlo, enviarlo digitalmente o archivarlo. |
| **Criterios de aceptación** | El docente puede elegir entre exportar en PDF o Word. |
| | El archivo conserva todo el contenido aprobado por el docente, incluidos comentarios cualitativos. |
| | La exportación se completa en menos de 30 segundos. |
| | El archivo descargado no requiere edición adicional. |

---

### Módulo 4 — Panel del Docente

#### HU-28: Ver resumen diario de pendientes al iniciar sesión

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-28 — Ver resumen diario de pendientes al iniciar sesión |
| **Actor** | Docente |
| **Prioridad** | Alta |
| **Narrativa** | Como docente, quiero ver un resumen visual al iniciar sesión con los grupos sin asistencia registrada, notas pendientes e informes próximos a vencer, para saber qué debo atender hoy sin abrir múltiples sistemas. |
| **Criterios de aceptación** | Al iniciar sesión, el panel muestra: grupos sin asistencia del día, notas pendientes e informes próximos. |
| | El resumen se carga en menos de 3 segundos. |
| | Cada pendiente enlaza directamente a la acción correspondiente. |
| | El panel se actualiza automáticamente al iniciar sesión. |

#### HU-29: Recibir alertas de fechas de entrega configurables

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-29 — Recibir alertas de fechas de entrega configurables |
| **Actor** | Docente |
| **Prioridad** | Media |
| **Narrativa** | Como docente, quiero configurar mis propias fechas de entrega y recibir alertas visuales cuando se aproximan, para que ningún informe o reporte se me pase por alto. |
| **Criterios de aceptación** | El docente puede crear fechas de entrega con nombre, fecha y descripción. |
| | El sistema muestra alertas visuales en el panel al menos 3 días antes de la fecha. |
| | Las alertas diferencian visualmente entre urgentes (1 día o menos) y próximas (2–3 días). |
| | El docente puede marcar una fecha de entrega como completada para que desaparezca del panel. |

#### HU-30: Ver vista semanal de estado de planeaciones

| Campo | Detalle |
|---|---|
| **ID / Título** | HU-30 — Ver vista semanal de estado de planeaciones |
| **Actor** | Docente |
| **Prioridad** | Baja |
| **Narrativa** | Como docente, quiero ver una vista semanal que muestre qué clases tienen planeación lista y cuáles están pendientes, para organizar mi tiempo de preparación eficientemente. |
| **Criterios de aceptación** | El panel muestra un calendario semanal con las clases configuradas. |
| | Cada clase indica visualmente si tiene planeación lista o está pendiente. |
| | El docente puede acceder directamente a crear o editar la planeación desde la vista semanal. |
| | La vista se actualiza automáticamente al guardar una planeación. |

---

## Requisitos Funcionales

Los 30 requisitos funcionales describen el comportamiento exacto que el sistema debe ofrecer. Cada RF está vinculado a las HUs que lo originan, incluye precondición, postcondición y criterio en formato Gherkin (Dado/Cuando/Entonces), siguiendo IEEE 29148:2018 e IEEE 830.

---

### Transversal — Autenticación y Cuenta

#### RF-01: Registro de cuenta con consentimiento explícito

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-01 — Registro de cuenta con consentimiento explícito |
| **HU relacionadas** | HU-01 |
| **Actor** | Docente |
| **Descripción** | El sistema debe permitir crear una cuenta con correo y contraseña, validar que el correo no exista previamente, exigir mínimo 8 caracteres en la contraseña, y requerir aceptación explícita de la política de tratamiento de datos conforme a la Ley 1581 de 2012. |
| **Precondición** | El docente accede a la pantalla de registro desde un navegador compatible. |
| **Postcondición** | La cuenta queda creada y el consentimiento queda registrado. El docente es redirigido al flujo de onboarding. |
| **Criterio Gherkin** | **Dado que** el docente completa el formulario de registro con un correo nuevo, contraseña válida y acepta la política de datos **Cuando** confirma el registro **Entonces** el sistema crea la cuenta, registra el consentimiento y redirige al docente al flujo de onboarding. |

#### RF-02: Autenticación segura con bloqueo por intentos fallidos

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-02 — Autenticación segura con bloqueo por intentos fallidos |
| **HU relacionadas** | HU-02 |
| **Actor** | Docente |
| **Descripción** | El sistema debe autenticar al docente con correo y contraseña usando cifrado TLS. Tras 5 intentos fallidos consecutivos, debe bloquear el acceso durante 15 minutos y notificar al usuario. |
| **Precondición** | El docente accede a la pantalla de inicio de sesión. |
| **Postcondición** | El docente queda autenticado con sesión activa, o recibe mensaje de error/bloqueo según el caso. |
| **Criterio Gherkin** | **Dado que** el docente ingresa credenciales válidas **Cuando** confirma el inicio de sesión **Entonces** el sistema autentica al docente con cifrado TLS y establece sesión persistente. |

#### RF-03: Recuperación de contraseña por correo

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-03 — Recuperación de contraseña por correo |
| **HU relacionadas** | HU-03 |
| **Actor** | Docente |
| **Descripción** | El sistema debe enviar un correo con un enlace de recuperación válido por 30 minutos al docente que lo solicite, permitiéndole establecer una nueva contraseña. El enlace debe invalidarse tras su uso. |
| **Precondición** | El docente accede a la opción de recuperar contraseña e ingresa su correo registrado. |
| **Postcondición** | El docente puede establecer una nueva contraseña y acceder a su cuenta. |
| **Criterio Gherkin** | **Dado que** el docente ingresa su correo en la pantalla de recuperación **Cuando** solicita el enlace de recuperación **Entonces** el sistema envía un correo con un enlace válido por 30 minutos para restablecer la contraseña. |

#### RF-04: Cierre de sesión seguro

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-04 — Cierre de sesión seguro |
| **HU relacionadas** | HU-04 |
| **Actor** | Docente |
| **Descripción** | El sistema debe permitir al docente cerrar sesión desde cualquier pantalla, invalidar la sesión en el servidor al hacerlo y redirigir a la pantalla de inicio de sesión. |
| **Precondición** | El docente tiene una sesión activa en la plataforma. |
| **Postcondición** | La sesión queda invalidada en servidor y cliente. El docente es redirigido a la pantalla de inicio de sesión. |
| **Criterio Gherkin** | **Dado que** el docente tiene una sesión activa y selecciona cerrar sesión **Cuando** confirma la acción **Entonces** el sistema invalida la sesión en el servidor y redirige al docente a la pantalla de inicio de sesión. |

#### RF-05: Interfaz responsiva sin instalación

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-05 — Interfaz responsiva sin instalación |
| **HU relacionadas** | HU-05 |
| **Actor** | Docente |
| **Descripción** | El sistema debe funcionar desde Chrome, Safari y Firefox sin instalación, con interfaz responsiva adaptada a celular (320px), tablet (768px) y computador (1280px+), siguiendo el principio de una acción principal por pantalla. |
| **Precondición** | El dispositivo cuenta con un navegador compatible y acceso a la URL de la plataforma. |
| **Postcondición** | El docente completa su primer registro de asistencia en menos de 2 minutos. |
| **Criterio Gherkin** | **Dado que** el docente accede a la plataforma desde un celular con Chrome sin instalación **Cuando** navega a la pantalla de registro de asistencia **Entonces** la interfaz se adapta correctamente al tamaño de pantalla y el docente puede completar el registro en menos de 2 minutos. |

---

### Onboarding — Configuración Inicial

#### RF-06: Creación de clase con datos completos

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-06 — Creación de clase con datos completos |
| **HU relacionadas** | HU-06 |
| **Actor** | Docente |
| **Descripción** | El sistema debe permitir crear una clase con nombre, nivel educativo (primaria, secundaria, técnico, universitario), asignatura, área y período académico. La clase queda disponible en todos los módulos al ser creada. |
| **Precondición** | El docente ha iniciado sesión. |
| **Postcondición** | La clase aparece activa en el panel y disponible en todos los módulos. |
| **Criterio Gherkin** | **Dado que** el docente completa el formulario de creación de clase con nombre, nivel, asignatura, área y período **Cuando** confirma la creación **Entonces** el sistema crea la clase y la muestra disponible en el panel y en todos los módulos de registro, planeación e informes. |

#### RF-07: Importación de lista de estudiantes desde Excel o CSV

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-07 — Importación de lista de estudiantes desde Excel o CSV |
| **HU relacionadas** | HU-07 |
| **Actor** | Docente |
| **Descripción** | El sistema debe procesar archivos .xlsx y .csv para importar nombres de estudiantes, mostrar previsualización con el número detectado, indicar errores por fila, e importar la lista tras confirmación del docente. |
| **Precondición** | El docente ha creado al menos una clase (RF-06). |
| **Postcondición** | La lista de estudiantes queda precargada en la clase y disponible para registro de asistencia y notas. |
| **Criterio Gherkin** | **Dado que** el docente sube un archivo Excel válido con nombres de estudiantes en la clase ya creada **Cuando** revisa la previsualización y confirma la importación **Entonces** el sistema importa la lista completa y la muestra precargada en el módulo de asistencia. |

#### RF-08: Configuración de escala y categorías de calificación

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-08 — Configuración de escala y categorías de calificación |
| **HU relacionadas** | HU-08 |
| **Actor** | Docente |
| **Descripción** | El sistema debe permitir definir nota mínima, máxima y tipos de evaluación con pesos porcentuales por clase. Debe validar que la suma de pesos sea exactamente 100% antes de guardar. |
| **Precondición** | El docente ha creado al menos una clase (RF-06). |
| **Postcondición** | La escala queda vinculada a la clase y disponible para cálculo automático en RF-19. |
| **Criterio Gherkin** | **Dado que** el docente define los tipos de evaluación con sus pesos para una clase **Cuando** intenta guardar **Entonces** el sistema valida que los pesos sumen 100% y guarda; si no suman 100% muestra aviso con la diferencia y no permite guardar. |

#### RF-09: Edición de datos de una clase existente

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-09 — Edición de datos de una clase existente |
| **HU relacionadas** | HU-09 |
| **Actor** | Docente |
| **Descripción** | El sistema debe permitir editar nombre, nivel, asignatura, área y período de una clase ya creada, reflejando los cambios en todos los módulos. |
| **Precondición** | El docente tiene al menos una clase creada. |
| **Postcondición** | Los datos de la clase quedan actualizados y los cambios se reflejan en todos los módulos. |
| **Criterio Gherkin** | **Dado que** el docente accede a la opción de editar una clase y modifica su nombre **Cuando** guarda los cambios **Entonces** el sistema actualiza el nombre en todos los módulos y muestra confirmación. |

#### RF-10: Gestión individual de estudiantes en la lista

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-10 — Gestión individual de estudiantes en la lista |
| **HU relacionadas** | HU-10 |
| **Actor** | Docente |
| **Descripción** | El sistema debe permitir agregar un estudiante nuevo manualmente y editar el nombre de un estudiante existente, reflejando los cambios de inmediato en asistencia y notas. |
| **Precondición** | La clase tiene una lista de estudiantes cargada. |
| **Postcondición** | El estudiante agregado o editado aparece de inmediato en el módulo de asistencia y notas. |
| **Criterio Gherkin** | **Dado que** el docente agrega un nuevo estudiante con su nombre en la clase **Cuando** confirma la adición **Entonces** el estudiante aparece de inmediato en la lista de asistencia y disponible para registro de notas. |

#### RF-11: Archivar y desarchivar clases

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-11 — Archivar y desarchivar clases |
| **HU relacionadas** | HU-11 |
| **Actor** | Docente |
| **Descripción** | El sistema debe permitir archivar una clase activa, ocultarla del panel principal y mantener accesibles todos sus registros desde una sección de archivo. Debe permitir también desarchivar. |
| **Precondición** | El docente tiene al menos una clase activa. |
| **Postcondición** | La clase archivada desaparece del panel principal pero es accesible con todos sus datos desde el archivo. |
| **Criterio Gherkin** | **Dado que** el docente selecciona archivar una clase activa **Cuando** confirma la acción **Entonces** la clase desaparece del panel principal y sus datos quedan accesibles íntegramente desde la sección de clases archivadas. |

---

### Módulo 1 — Asistente de Planeación

#### RF-12: Exploración de biblioteca de objetivos curriculares

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-12 — Exploración de biblioteca de objetivos curriculares |
| **HU relacionadas** | HU-12 |
| **Actor** | Docente |
| **Descripción** | El sistema debe proveer una biblioteca de objetivos curriculares organizados por área, grado y período, con búsqueda por palabra clave y visualización de descripción completa antes de seleccionar. |
| **Precondición** | El docente ha iniciado sesión y accede al módulo de planeación. |
| **Postcondición** | El objetivo seleccionado queda disponible como entrada para la generación del esquema (RF-13). |
| **Criterio Gherkin** | **Dado que** el docente accede a la biblioteca y filtra por área y grado **Cuando** selecciona un objetivo de la lista **Entonces** el sistema muestra la descripción completa del objetivo y lo marca como seleccionado para generar el esquema de planeación. |

#### RF-13: Generación de esquema de planeación con IA

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-13 — Generación de esquema de planeación con IA |
| **HU relacionadas** | HU-13 |
| **Actor** | Docente |
| **Descripción** | El sistema debe generar automáticamente un esquema de planeación (actividades, recursos, criterios de evaluación y tiempo estimado) a partir del objetivo seleccionado, en menos de 30 segundos. |
| **Precondición** | El docente ha seleccionado un objetivo curricular de la biblioteca (RF-12). |
| **Postcondición** | El esquema aparece completo y editable en la pantalla. |
| **Criterio Gherkin** | **Dado que** el docente ha seleccionado un objetivo y solicita generar el esquema **Cuando** la generación se completa **Entonces** el sistema presenta en menos de 30 s el esquema completo con actividades, recursos, criterios y tiempo, editable en todos sus campos. |

#### RF-14: Edición y guardado de esquema de planeación

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-14 — Edición y guardado de esquema de planeación |
| **HU relacionadas** | HU-14 |
| **Actor** | Docente |
| **Descripción** | El sistema debe permitir editar cualquier campo del esquema generado y guardarlo, con opción de descartar cambios y volver al borrador original. |
| **Precondición** | El docente tiene un esquema de planeación generado o existente. |
| **Postcondición** | El esquema queda guardado con las modificaciones del docente. |
| **Criterio Gherkin** | **Dado que** el docente modifica una actividad del esquema de planeación **Cuando** guarda los cambios **Entonces** el sistema almacena la planeación modificada y muestra confirmación de guardado. |

#### RF-15: Repositorio de planeaciones y duplicación

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-15 — Repositorio de planeaciones y duplicación |
| **HU relacionadas** | HU-15 |
| **Actor** | Docente |
| **Descripción** | El sistema debe almacenar todas las planeaciones por período, área y grado, con búsqueda por palabra clave y función de duplicar para editar como nueva sin afectar la original. |
| **Precondición** | El docente tiene al menos una planeación guardada. |
| **Postcondición** | El docente puede acceder, buscar y duplicar planeaciones anteriores. |
| **Criterio Gherkin** | **Dado que** el docente accede al repositorio y filtra por área **Cuando** duplica una planeación existente **Entonces** el sistema crea una copia editable de la planeación sin modificar la original. |

#### RF-16: Exportar planeación en PDF o Word

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-16 — Exportar planeación en PDF o Word |
| **HU relacionadas** | HU-16 |
| **Actor** | Docente |
| **Descripción** | El sistema debe exportar cualquier planeación guardada en PDF o Word con todos sus campos en menos de 30 segundos, generando un archivo legible sin edición adicional. |
| **Precondición** | El docente tiene al menos una planeación guardada. |
| **Postcondición** | Se descarga el archivo en el formato seleccionado con todos los campos completos. |
| **Criterio Gherkin** | **Dado que** el docente tiene una planeación guardada y selecciona exportar en PDF **Cuando** confirma la exportación **Entonces** el sistema genera y descarga el archivo PDF en menos de 30 s con todos los campos completos. |

---

### Módulo 2 — Registro de Asistencia y Notas

#### RF-17: Registro de asistencia con lista precargada

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-17 — Registro de asistencia con lista precargada |
| **HU relacionadas** | HU-17 |
| **Actor** | Docente |
| **Descripción** | El sistema debe mostrar la lista precargada de la clase y permitir marcar presencia o ausencia con un toque por estudiante, guardando automáticamente con fecha y hora. |
| **Precondición** | La clase tiene lista de estudiantes importada (RF-07). |
| **Postcondición** | El registro de asistencia queda almacenado con fecha y hora en el historial. |
| **Criterio Gherkin** | **Dado que** el docente accede al módulo de asistencia de una clase con lista importada **Cuando** toca el nombre de un estudiante para marcar su estado **Entonces** el sistema guarda el registro automáticamente sin confirmación adicional y lo registra en el historial con fecha y hora. |

#### RF-18: Edición de registro de asistencia guardado

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-18 — Edición de registro de asistencia guardado |
| **HU relacionadas** | HU-18 |
| **Actor** | Docente |
| **Descripción** | El sistema debe permitir acceder a registros de asistencia de fechas pasadas y modificar el estado de cualquier estudiante, guardando la corrección con fecha de modificación. |
| **Precondición** | Existe al menos un registro de asistencia guardado. |
| **Postcondición** | La corrección queda almacenada con la fecha de modificación. |
| **Criterio Gherkin** | **Dado que** el docente accede al historial de asistencia de una fecha pasada **Cuando** cambia el estado de un estudiante y confirma **Entonces** el sistema guarda la corrección con la fecha de modificación y muestra confirmación. |

#### RF-19: Registro de notas y cálculo automático de promedios

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-19 — Registro de notas y cálculo automático de promedios |
| **HU relacionadas** | HU-19 |
| **Actor** | Docente |
| **Descripción** | El sistema debe permitir ingresar notas por tipo de evaluación y calcular automáticamente los promedios ponderados según la escala configurada (RF-08), mostrando el promedio acumulado del período. |
| **Precondición** | La clase tiene escala de calificación configurada (RF-08) y lista de estudiantes importada (RF-07). |
| **Postcondición** | Las notas y promedios quedan almacenados y disponibles en el historial. |
| **Criterio Gherkin** | **Dado que** el docente selecciona el tipo de evaluación e ingresa las notas de los estudiantes **Cuando** confirma el ingreso **Entonces** el sistema calcula el promedio ponderado automáticamente, actualiza el historial y muestra el promedio acumulado del período por estudiante. |

#### RF-20: Edición de nota ya registrada

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-20 — Edición de nota ya registrada |
| **HU relacionadas** | HU-20 |
| **Actor** | Docente |
| **Descripción** | El sistema debe permitir modificar una nota ya ingresada en cualquier evaluación pasada, recalcular el promedio automáticamente y guardar la corrección con fecha de modificación. |
| **Precondición** | Existe al menos una nota registrada. |
| **Postcondición** | La nota corregida queda almacenada, el promedio se recalcula y la modificación se registra con fecha. |
| **Criterio Gherkin** | **Dado que** el docente accede a las notas de una evaluación pasada y modifica la nota de un estudiante **Cuando** confirma el cambio **Entonces** el sistema actualiza la nota, recalcula el promedio del estudiante automáticamente y muestra confirmación. |

#### RF-21: Historial completo de registros con filtros

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-21 — Historial completo de registros con filtros |
| **HU relacionadas** | HU-21 |
| **Actor** | Docente |
| **Descripción** | El sistema debe proveer acceso al historial completo de asistencia y notas por grupo y período, filtrable por estudiante, fecha o tipo de evaluación, sin pérdida de datos entre sesiones. |
| **Precondición** | El docente ha realizado al menos un registro de asistencia o nota. |
| **Postcondición** | El historial muestra los registros correspondientes al filtro aplicado sin pérdida de datos. |
| **Criterio Gherkin** | **Dado que** el docente accede al historial de una clase **Cuando** aplica un filtro por estudiante **Entonces** el sistema muestra únicamente los registros de ese estudiante sin perder los datos del resto del grupo. |

#### RF-22: Modo offline con sincronización automática

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-22 — Modo offline con sincronización automática |
| **HU relacionadas** | HU-22 |
| **Actor** | Docente |
| **Descripción** | El sistema debe permitir registrar asistencia y notas sin conexión, almacenándolos localmente, y sincronizarlos automáticamente al recuperar conectividad sin pérdida de datos. |
| **Precondición** | La clase y la lista de estudiantes fueron cargadas estando conectado. |
| **Postcondición** | Los datos registrados offline se sincronizan íntegramente y el docente recibe confirmación visual. |
| **Criterio Gherkin** | **Dado que** el dispositivo del docente no tiene conexión **Cuando** registra asistencia o notas **Entonces** el sistema almacena los datos localmente; al recuperar señal los sincroniza y muestra confirmación de sincronización exitosa. |

---

### Módulo 3 — Generación de Informes y Evidencias

#### RF-23: Generación automática de informe en PDF

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-23 — Generación automática de informe en PDF |
| **HU relacionadas** | HU-23 |
| **Actor** | Docente |
| **Descripción** | El sistema debe generar un informe de desempeño en PDF por grupo, con datos del estudiante, asistencia, notas por actividad y promedio final, permitiendo seleccionar el período, en menos de 30 segundos. |
| **Precondición** | La clase tiene registros de asistencia y notas capturados. |
| **Postcondición** | Se genera la vista previa del informe lista para revisión y aprobación. |
| **Criterio Gherkin** | **Dado que** el docente solicita generar el informe de una clase con registros existentes **Cuando** selecciona el período y confirma **Entonces** el sistema genera el informe en menos de 30 s y muestra la vista previa completa. |

#### RF-24: Generación de borradores cualitativos con IA

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-24 — Generación de borradores cualitativos con IA |
| **HU relacionadas** | HU-24 |
| **Actor** | Docente |
| **Descripción** | El sistema debe usar IA para generar un borrador de comentario cualitativo diferenciado por estudiante, basado en sus notas y asistencia, editable y regenerable individualmente, en menos de 45 segundos para el grupo completo. |
| **Precondición** | El informe ha sido generado con datos cuantitativos del grupo. |
| **Postcondición** | Los comentarios en borrador quedan disponibles para edición, aprobación o regeneración individual. |
| **Criterio Gherkin** | **Dado que** el informe del período ha sido generado con datos cuantitativos **Cuando** el docente solicita los comentarios cualitativos **Entonces** la IA genera borradores diferenciados por estudiante en menos de 45 s; el docente puede editarlos, aprobarlos o regenerarlos individualmente. |

#### RF-25: Revisión y aprobación del informe antes de descarga

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-25 — Revisión y aprobación del informe antes de descarga |
| **HU relacionadas** | HU-25 |
| **Actor** | Docente |
| **Descripción** | El sistema debe permitir al docente revisar la vista previa completa del informe, editar cualquier campo y aprobarlo explícitamente antes de permitir la descarga. |
| **Precondición** | El informe ha sido generado y los comentarios cualitativos están disponibles. |
| **Postcondición** | El informe aprobado queda listo para exportación. No se descarga sin aprobación explícita. |
| **Criterio Gherkin** | **Dado que** el docente visualiza la vista previa del informe generado **Cuando** edita un comentario y aprueba el informe **Entonces** el sistema marca el informe como aprobado y habilita la descarga con el contenido modificado. |

#### RF-26: Adjuntar evidencias al informe

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-26 — Adjuntar evidencias al informe |
| **HU relacionadas** | HU-26 |
| **Actor** | Docente |
| **Descripción** | El sistema debe permitir adjuntar archivos (JPG, PNG, PDF, DOCX, máx. 10 MB cada uno) a un informe, vinculándolos al período correspondiente. |
| **Precondición** | El informe ha sido generado. |
| **Postcondición** | Los archivos adjuntos quedan vinculados al informe y período. |
| **Criterio Gherkin** | **Dado que** el docente sube una foto como evidencia en un informe generado **Cuando** confirma el adjunto **Entonces** el sistema vincula el archivo al informe y lo incluye como referencia en el documento descargable. |

#### RF-27: Exportar informe aprobado en PDF o Word

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-27 — Exportar informe aprobado en PDF o Word |
| **HU relacionadas** | HU-27 |
| **Actor** | Docente |
| **Descripción** | El sistema debe exportar el informe revisado y aprobado en PDF o Word, conservando todos los campos aprobados, en menos de 30 segundos. |
| **Precondición** | El docente ha aprobado el informe (RF-25). |
| **Postcondición** | Se descarga el archivo con el contenido completo aprobado sin requerir edición adicional. |
| **Criterio Gherkin** | **Dado que** el docente ha aprobado el informe y selecciona el formato de exportación **Cuando** confirma la descarga **Entonces** el sistema genera y descarga el archivo en menos de 30 s con todo el contenido aprobado. |

---

### Módulo 4 — Panel del Docente

#### RF-28: Panel de pendientes diarios al iniciar sesión

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-28 — Panel de pendientes diarios al iniciar sesión |
| **HU relacionadas** | HU-28 |
| **Actor** | Docente |
| **Descripción** | El sistema debe mostrar al iniciar sesión un resumen diario con grupos sin asistencia, notas pendientes e informes próximos, en menos de 3 segundos, con enlace directo a cada acción. |
| **Precondición** | El docente tiene clases activas configuradas. |
| **Postcondición** | El panel muestra el resumen actualizado con enlaces directos a cada pendiente. |
| **Criterio Gherkin** | **Dado que** el docente inicia sesión con clases activas **Cuando** el panel principal carga **Entonces** el sistema muestra en menos de 3 s los grupos sin asistencia del día, notas pendientes e informes próximos, cada uno con enlace directo. |

#### RF-29: Alertas de fechas de entrega configurables por el docente

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-29 — Alertas de fechas de entrega configurables por el docente |
| **HU relacionadas** | HU-29 |
| **Actor** | Docente |
| **Descripción** | El sistema debe permitir crear fechas de entrega propias y mostrar alertas visuales en el panel diferenciando urgentes (≤ 1 día) de próximas (2–3 días), con opción de marcar como completada. |
| **Precondición** | El docente ha configurado al menos una fecha de entrega. |
| **Postcondición** | Las alertas se muestran con la diferenciación visual correcta. |
| **Criterio Gherkin** | **Dado que** el docente tiene una fecha de entrega configurada a 1 día **Cuando** inicia sesión y el panel carga **Entonces** el sistema muestra la alerta marcada visualmente como urgente, distinguiéndola de las fechas próximas. |

#### RF-30: Vista semanal de estado de planeaciones

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RF-30 — Vista semanal de estado de planeaciones |
| **HU relacionadas** | HU-30 |
| **Actor** | Docente |
| **Descripción** | El sistema debe mostrar un calendario semanal con las clases configuradas, indicando visualmente el estado de planeación (lista o pendiente) de cada clase, con acceso directo para crear o editar. |
| **Precondición** | El docente tiene clases configuradas. |
| **Postcondición** | La vista semanal refleja el estado actualizado al guardar cualquier planeación. |
| **Criterio Gherkin** | **Dado que** el docente accede a la vista semanal del panel **Cuando** visualiza las clases de la semana **Entonces** el sistema indica con señal visual diferenciada cuáles tienen planeación lista y cuáles están pendientes, con acceso directo para crearla o editarla. |

---

## Requisitos No Funcionales

Los 10 requisitos no funcionales definen cómo debe comportarse el sistema Tiza. Están mapeados a ISO/IEC 25010:2023 y siguen IEEE 29148:2018 — cada uno incluye métrica cuantificada, umbral mínimo y forma concreta de verificación, todos calibrados al piloto de 2 meses.

---

### Rendimiento

#### RNF-P01: Tiempo de respuesta bajo carga normal del piloto

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RNF-P01 — Tiempo de respuesta bajo carga normal del piloto |
| **Categoría ISO 25010** | Rendimiento — Tiempo de respuesta |
| **HU relacionadas** | HU-02, HU-17, HU-19, HU-28 |
| **Especificación** | El sistema debe responder al 95% de las peticiones (carga de pantalla, guardado, consulta de historial) en ≤ 2 segundos bajo carga de hasta 50 usuarios concurrentes durante el piloto. |
| **Métrica / Umbral** | P95 de latencia ≤ 2 s con 50 VU concurrentes. Medido con k6 o JMeter en entorno de staging. |
| **Forma de verificación** | Prueba de carga con k6: 50 VU durante 5 minutos en rutas críticas (login, asistencia, notas, panel). Validar que P95 ≤ 2 s. |

#### RNF-P02: Tiempo de generación con IA dentro de umbral

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RNF-P02 — Tiempo de generación con IA dentro de umbral |
| **Categoría ISO 25010** | Rendimiento — Tiempo de respuesta |
| **HU relacionadas** | HU-13, HU-24 |
| **Especificación** | Las operaciones de generación con IA deben completarse en ≤ 30 segundos para esquemas de planeación y ≤ 45 segundos para comentarios cualitativos de un grupo completo. |
| **Métrica / Umbral** | 100% de solicitudes IA dentro del umbral. Medido con logs de tiempo de la Gemini API en producción. |
| **Forma de verificación** | Log de tiempos de respuesta de Gemini API. Alerta automática si alguna solicitud supera el umbral. |

---

### Seguridad

#### RNF-S01: Cifrado de datos en tránsito y en reposo

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RNF-S01 — Cifrado de datos en tránsito y en reposo |
| **Categoría ISO 25010** | Seguridad — Confidencialidad e Integridad |
| **HU relacionadas** | HU-01, HU-02, HU-22, HU-23 |
| **Especificación** | Toda comunicación debe usar TLS 1.2 o superior. Las contraseñas se almacenan con bcrypt (cost factor ≥ 10). Los datos académicos se cifran en reposo con el mecanismo nativo de Supabase. |
| **Métrica / Umbral** | 0 comunicaciones sin cifrar. Hash bcrypt con factor ≥ 10. Certificado TLS válido en producción. |
| **Forma de verificación** | Inspección SSL Labs (puntuación mínima A). Revisión de configuración de Supabase. Auditoría manual del hash en BD. |

#### RNF-S02: Cumplimiento Ley 1581 de 2012 — habeas data Colombia

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RNF-S02 — Cumplimiento Ley 1581 de 2012 — habeas data Colombia |
| **Categoría ISO 25010** | Seguridad — Privacidad |
| **HU relacionadas** | HU-01, HU-03, HU-04 |
| **Especificación** | El sistema debe obtener consentimiento explícito en el registro, mostrar la política de datos, permitir solicitar eliminación de cuenta y datos, y no compartir datos con terceros no autorizados. |
| **Métrica / Umbral** | 100% de usuarios con consentimiento registrado. Funcionalidad de eliminación operativa. Sin transferencia a terceros no autorizados. |
| **Forma de verificación** | Revisión del flujo de registro (checkbox de consentimiento). Prueba funcional de eliminación de datos. Revisión de contratos con Supabase y Gemini API. |

---

### Usabilidad

#### RNF-U01: Primer registro de asistencia en ≤ 2 minutos sin capacitación

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RNF-U01 — Primer registro de asistencia en ≤ 2 minutos sin capacitación |
| **Categoría ISO 25010** | Usabilidad — Aprendibilidad |
| **HU relacionadas** | HU-05, HU-17 |
| **Especificación** | Un docente que accede por primera vez debe poder completar su primer registro de asistencia en ≤ 2 minutos desde que ingresa, sin asistencia externa ni manual. |
| **Métrica / Umbral** | ≥ 80% de docentes en prueba de usabilidad completan el registro en ≤ 2 minutos en primer intento. |
| **Forma de verificación** | Prueba con 5 docentes piloto: cronometrar desde ingreso a la pantalla de asistencia hasta registro guardado. Registrar puntos de fricción. |

#### RNF-U02: Diseño responsivo sin errores visuales en múltiples dispositivos

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RNF-U02 — Diseño responsivo sin errores visuales en múltiples dispositivos |
| **Categoría ISO 25010** | Usabilidad — Accesibilidad y Operabilidad |
| **HU relacionadas** | HU-05, HU-17, HU-28 |
| **Especificación** | La interfaz debe adaptarse sin errores a resoluciones de 320px, 768px y 1280px en Chrome, Safari y Firefox, sin elementos superpuestos, texto cortado ni scroll horizontal. |
| **Métrica / Umbral** | 0 errores visuales críticos en las 3 resoluciones y los 3 navegadores objetivo. |
| **Forma de verificación** | Checklist de 10 pantallas críticas en cada combinación dispositivo/navegador. Prueba en BrowserStack o dispositivos físicos. |

#### RNF-U03: Onboarding completo en ≤ 10 minutos

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RNF-U03 — Onboarding completo en ≤ 10 minutos |
| **Categoría ISO 25010** | Usabilidad — Aprendibilidad |
| **HU relacionadas** | HU-06, HU-07, HU-08 |
| **Especificación** | Un docente nuevo debe poder completar el onboarding completo (crear clase, cargar lista de estudiantes desde Excel y configurar escala de calificación) en ≤ 10 minutos sin asistencia. |
| **Métrica / Umbral** | ≥ 80% de docentes en prueba completan el onboarding en ≤ 10 min en primer intento. |
| **Forma de verificación** | Prueba con 5 docentes piloto: cronometrar desde creación de cuenta hasta primer registro de asistencia disponible. Registrar puntos de abandono. |

---

### Fiabilidad

#### RNF-D01: Disponibilidad ≥ 95% durante el piloto

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RNF-D01 — Disponibilidad ≥ 95% durante el piloto |
| **Categoría ISO 25010** | Fiabilidad — Disponibilidad |
| **HU relacionadas** | HU-02, HU-17, HU-19, HU-28 |
| **Especificación** | El sistema debe estar disponible al menos el 95% del tiempo durante las semanas 7–8 del piloto, excluyendo mantenimientos programados notificados con 24 horas de anticipación. |
| **Métrica / Umbral** | Disponibilidad ≥ 95% medida con monitoreo activo durante el piloto. |
| **Forma de verificación** | Dashboard de UptimeRobot configurado desde el inicio del piloto. Reporte de disponibilidad al cierre de las semanas 7 y 8. |

---

### Compatibilidad

#### RNF-C01: Compatibilidad con navegadores sin instalación

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RNF-C01 — Compatibilidad con navegadores sin instalación |
| **Categoría ISO 25010** | Compatibilidad — Interoperabilidad |
| **HU relacionadas** | HU-05 |
| **Especificación** | La plataforma debe funcionar sin errores en las versiones más recientes de Chrome (Android y escritorio), Safari (iOS y macOS) y Firefox (escritorio), sin extensiones ni apps nativas. |
| **Métrica / Umbral** | 0 errores funcionales bloqueantes en los 3 navegadores en sus versiones actuales. |
| **Forma de verificación** | Matriz de pruebas: ejecutar los 5 flujos críticos (registro, asistencia, notas, informe, panel) en cada combinación navegador-dispositivo. |

---

### Mantenibilidad

#### RNF-M01: Código modular, documentado y con cobertura mínima

| Campo | Detalle |
|---|---|
| **ID / Nombre** | RNF-M01 — Código modular, documentado y con cobertura mínima |
| **Categoría ISO 25010** | Mantenibilidad — Modificabilidad y Modularidad |
| **HU relacionadas** | HU-13, HU-17, HU-23, HU-02 |
| **Especificación** | El código debe organizarse en módulos funcionales (autenticación, onboarding, planeación, registro, informes, panel), con README por módulo, variables de entorno documentadas y sin dependencias circulares. |
| **Métrica / Umbral** | 100% de módulos con README. 0 dependencias circulares. Cobertura de código ≥ 60% en funciones críticas. |
| **Forma de verificación** | Revisión de estructura del repositorio. Análisis con ESLint. Reporte de cobertura con Jest o Vitest al final del piloto. |

---

## Matriz de Trazabilidad

La siguiente tabla conecta cada historia de usuario con su requisito funcional y los requisitos no funcionales que la afectan, garantizando cobertura completa del sistema sin HUs ni RFs huérfanos.

| HU | Título resumido | RF | RNF |
|---|---|---|---|
| HU-01 | Registrarse | RF-01 | RNF-S01, RNF-S02 |
| HU-02 | Iniciar sesión | RF-02 | RNF-S01, RNF-D01 |
| HU-03 | Recuperar contraseña | RF-03 | RNF-S01 |
| HU-04 | Cerrar sesión | RF-04 | RNF-S01 |
| HU-05 | Dispositivo sin instalación | RF-05 | RNF-U01, RNF-U02, RNF-C01 |
| HU-06 | Crear clase | RF-06 | RNF-U03 |
| HU-07 | Cargar lista Excel | RF-07 | RNF-U03, RNF-S02 |
| HU-08 | Configurar escala | RF-08 | RNF-U03 |
| HU-09 | Editar datos clase | RF-09 | RNF-P01 |
| HU-10 | Gestionar estudiante | RF-10 | RNF-P01 |
| HU-11 | Archivar clase | RF-11 | RNF-P01 |
| HU-12 | Explorar objetivos | RF-12 | RNF-P01 |
| HU-13 | Generar planeación IA | RF-13 | RNF-P02, RNF-M01 |
| HU-14 | Editar y guardar planeación | RF-14 | RNF-P01 |
| HU-15 | Reutilizar planeaciones | RF-15 | RNF-P01 |
| HU-16 | Exportar planeación | RF-16 | RNF-P01 |
| HU-17 | Registrar asistencia | RF-17 | RNF-P01, RNF-U01, RNF-U02, RNF-D01 |
| HU-18 | Editar asistencia | RF-18 | RNF-P01 |
| HU-19 | Registrar notas | RF-19 | RNF-P01, RNF-D01 |
| HU-20 | Editar nota | RF-20 | RNF-P01 |
| HU-21 | Historial registros | RF-21 | RNF-P01, RNF-S01 |
| HU-22 | Modo offline | RF-22 | RNF-S01, RNF-D01 |
| HU-23 | Generar informe PDF | RF-23 | RNF-P01, RNF-P02, RNF-S01 |
| HU-24 | Comentarios cualitativos IA | RF-24 | RNF-P02, RNF-S02 |
| HU-25 | Revisar y aprobar informe | RF-25 | RNF-P01 |
| HU-26 | Adjuntar evidencias | RF-26 | RNF-S01 |
| HU-27 | Exportar informe | RF-27 | RNF-P01 |
| HU-28 | Panel de pendientes | RF-28 | RNF-P01, RNF-U02, RNF-D01 |
| HU-29 | Alertas fechas entrega | RF-29 | RNF-P01 |
| HU-30 | Vista semanal planeaciones | RF-30 | RNF-U02 |

---

*TIZA — HU · RF · RNF · v3.0 · Capstone Design Project · 2025*
