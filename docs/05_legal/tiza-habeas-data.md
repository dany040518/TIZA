# Habeas Data y Tratamiento de Datos Personales — TIZA

**Última actualización:** 19 de mayo de 2026
**Versión:** 1.0

**Marco normativo:** Ley 1581 de 2012 · Decreto 1377 de 2013 · Decreto Único Reglamentario 1074 de 2015

---

## Introducción

El derecho de **Habeas Data** es un derecho fundamental consagrado en el artículo 15 de la Constitución Política de Colombia, que permite a toda persona conocer, actualizar y rectificar la información que sobre ella se haya recopilado en bases de datos o archivos.

TIZA, como responsable del tratamiento de datos personales de sus usuarios, cumple con las disposiciones de la **Ley 1581 de 2012** y demás normas concordantes, y garantiza el pleno ejercicio de este derecho a cada titular.

Este documento describe, de forma clara y accesible, cómo TIZA trata sus datos personales, cuáles son sus derechos como titular y cómo puede ejercerlos.

---

## 1. Responsable del Tratamiento

**Aplicación:** TIZA — PWA de planeación pedagógica asistida por IA

**Actividad:** Desarrollo y operación de herramienta educativa digital

**Domicilio:** Colombia

**Canal de contacto:** Canal de soporte disponible dentro de la aplicación o correo electrónico indicado en la sección de soporte.

**Registro ante la SIC:** TIZA opera bajo las disposiciones de la Ley 1581 de 2012. Si la base de datos supera los límites que exigen inscripción ante el Registro Nacional de Bases de Datos (RNBD) de la Superintendencia de Industria y Comercio, procederá a su registro en los términos legales.

---

## 2. Bases de Datos Administradas

TIZA administra las siguientes bases de datos:

### 2.1 Base de datos de Usuarios (Docentes)

| Campo | Descripción | Obligatorio |
|-------|-------------|-------------|
| Identificador único (UUID) | Generado automáticamente por el sistema | Sí |
| Nombre completo | Nombre del docente registrado | Sí |
| Correo electrónico | Dirección de correo para autenticación y comunicaciones | Sí |
| Institución educativa | Nombre de la institución a la que pertenece el docente | No |
| Rol | Rol asignado en la plataforma (por defecto: "teacher") | Sí |
| Fecha de registro | Timestamp de creación de la cuenta | Sí (automático) |

### 2.2 Base de datos de Contenido Pedagógico

| Campo | Descripción |
|-------|-------------|
| Identificador del plan (UUID) | Generado automáticamente |
| Identificador del docente (UUID) | Vínculo con el titular del dato |
| Asignatura, grado, tema, título | Información del plan de lección |
| Tipo de clase, objetivo, materiales | Contenido pedagógico |
| Secuencia didáctica | Estructura de la clase |
| Criterios de evaluación | Estrategias de evaluación del plan |
| Fecha de creación | Timestamp automático |

**Importante:** TIZA **no** crea ni administra bases de datos con información personal de estudiantes menores de edad. Los planes de lección son documentos pedagógicos del docente y no deben contener datos identificables de estudiantes.

---

## 3. Finalidades del Tratamiento

El tratamiento de sus datos personales se realiza para las siguientes finalidades, debidamente informadas y aceptadas por el Titular al momento del registro:

| # | Finalidad | Base jurídica |
|---|-----------|---------------|
| 1 | Crear y gestionar la cuenta de usuario en la plataforma | Ejecución del contrato de prestación de servicios |
| 2 | Autenticar la identidad del Usuario en cada sesión | Ejecución del contrato / seguridad de la plataforma |
| 3 | Almacenar y asociar los planes de lección al perfil del docente | Ejecución del contrato |
| 4 | Enviar comunicaciones sobre el servicio (actualizaciones, avisos de seguridad) | Ejecución del contrato / interés legítimo |
| 5 | Garantizar la seguridad e integridad de la plataforma | Interés legítimo |
| 6 | Atender peticiones, quejas y reclamos del Titular | Cumplimiento legal (Ley 1581 de 2012) |
| 7 | Cumplir obligaciones legales ante autoridades competentes | Cumplimiento legal |

---

## 4. Autorización para el Tratamiento

De conformidad con el artículo 9 de la Ley 1581 de 2012, el tratamiento de datos personales requiere la **autorización previa, expresa e informada del Titular**.

TIZA obtiene esta autorización mediante:

- El proceso de **registro en la plataforma**, donde el Usuario, antes de crear su cuenta, es informado sobre el tratamiento de sus datos y acepta expresamente esta Política marcando la casilla correspondiente.
- La opción de **autenticación con Google OAuth**, cuyo flujo incluye el consentimiento explícito del Usuario.

Esta autorización puede ser **revocada** en cualquier momento, conforme al procedimiento descrito en la sección 7 de este documento.

---

## 5. Derechos del Titular

Como titular de datos personales, usted tiene los siguientes derechos, garantizados por el artículo 8 de la Ley 1581 de 2012:

### Derecho de Acceso (Conocer)
Tiene derecho a conocer qué datos suyos están siendo tratados, la finalidad del tratamiento, las transferencias realizadas y las condiciones del tratamiento. El acceso es **gratuito** al menos una vez al mes o cada vez que se realice una modificación sustancial.

### Derecho de Actualización
Puede solicitar que sus datos sean actualizados cuando estén desactualizados o incompletos.

### Derecho de Rectificación
Tiene derecho a que sus datos sean corregidos cuando sean inexactos o no correspondan a la realidad.

### Derecho de Supresión ("Derecho al Olvido")
Puede solicitar la eliminación de sus datos cuando:
- Ya no sean necesarios para la finalidad que motivó su recolección.
- Haya revocado su autorización y no exista base legal que legitime el tratamiento.
- El tratamiento no se ajuste a lo dispuesto en la Ley 1581 de 2012.

La supresión no procede cuando el titular tenga el deber legal o contractual de permanecer en la base de datos.

### Derecho de Revocación de Autorización
Puede revocar el consentimiento otorgado para el tratamiento de sus datos en cualquier momento, sin que ello tenga efectos retroactivos.

### Derecho de Reclamación ante la SIC
Si considera que TIZA ha vulnerado sus derechos como titular, puede presentar una queja ante la **Superintendencia de Industria y Comercio (SIC)**, autoridad de protección de datos personales en Colombia: [www.sic.gov.co](https://www.sic.gov.co).

---

## 6. Tratamiento de Datos en el Contexto Educativo

### 6.1 Responsabilidad del docente frente a datos de terceros

TIZA está diseñado para el uso exclusivo del docente titular de la cuenta. Si en el uso de la plataforma el docente incluye información que permita identificar a estudiantes (por ejemplo, al escribir nombres en los campos de texto libre de un plan de lección), el docente actúa como **responsable del tratamiento** de esos datos frente a sus estudiantes y sus representantes, y debe cumplir con las obligaciones que ello implica bajo la Ley 1581 de 2012.

TIZA recomienda enfáticamente:

- **No incluir nombres, documentos de identidad ni datos sensibles de estudiantes** en los campos de texto de los planes de lección.
- Usar referencias genéricas (e.g., "estudiante de grado 5°", "grupo A") en lugar de información identificable.
- Contar con las autorizaciones correspondientes de representantes legales si, en el contexto institucional, se procesan datos de menores.

### 6.2 Datos de menores de edad

En cumplimiento del artículo 7 de la Ley 1581 de 2012 y de los principios de protección reforzada aplicables a datos de menores, TIZA:

- **No recopila directamente** datos personales de menores de edad.
- **No permite** el registro de cuentas a personas menores de 18 años sin la autorización de la institución educativa o representante legal.
- Advierte al Usuario sobre su responsabilidad al gestionar contenido que involucre información de estudiantes.

---

## 7. Procedimiento para el Ejercicio de Derechos (PQRS)

Para ejercer sus derechos de Habeas Data, siga el siguiente procedimiento:

### Paso 1 — Presente su solicitud

Envíe su solicitud a través de:
- El **canal de reporte de errores o soporte** disponible dentro de la aplicación TIZA.
- El **correo electrónico de contacto** indicado en la sección de soporte de la aplicación.

Su solicitud debe incluir:
- Nombre completo del Titular.
- Correo electrónico asociado a la cuenta de TIZA.
- Descripción clara del derecho que desea ejercer.
- Documentos de soporte si son necesarios (p. ej., para rectificación, el documento con la información correcta).

### Paso 2 — Procesamiento

| Tipo de solicitud | Plazo de respuesta |
|-------------------|--------------------|
| Consulta (conocer, acceder a datos) | Máximo **10 días hábiles** (prorrogables 5 días hábiles más con notificación previa) |
| Reclamo (rectificación, supresión, revocación) | Máximo **15 días hábiles** (prorrogables 8 días hábiles más con notificación previa) |

Los plazos se cuentan a partir del día hábil siguiente a la recepción de la solicitud completa.

### Paso 3 — Resolución

TIZA le notificará el resultado de su solicitud al correo electrónico registrado. Si la solicitud es procedente, ejecutará la acción correspondiente (actualización, rectificación o supresión) en el plazo indicado.

### Paso 4 — Recurso ante la SIC

Si la respuesta de TIZA no satisface su solicitud o no recibe respuesta en el plazo legal, puede elevar una queja directamente ante la Superintendencia de Industria y Comercio:

**Superintendencia de Industria y Comercio**
Carrera 13 No. 27-00, Bogotá D.C., Colombia
Teléfono: (601) 587 0000
Sitio web: [www.sic.gov.co](https://www.sic.gov.co)

---

## 8. Transferencia y Transmisión Internacional de Datos

TIZA transfiere datos a los siguientes destinatarios ubicados fuera de Colombia:

| Destinatario | País/Región | Finalidad | Nivel de protección |
|---|---|---|---|
| Supabase Inc. | Estados Unidos | Almacenamiento y autenticación | Cláusulas contractuales estándar |
| Google LLC (Gemini API) | Estados Unidos | Procesamiento de prompts para generación de contenido IA | Cláusulas contractuales estándar |
| Vercel Inc. | Estados Unidos | Alojamiento y red de distribución de contenido | Cláusulas contractuales estándar |

Estas transferencias se realizan en cumplimiento del artículo 26 de la Ley 1581 de 2012, bajo la base jurídica de ser **necesarias para la ejecución del contrato de prestación del servicio** aceptado por el Titular al registrarse.

TIZA exige a los encargados internacionales el compromiso de mantener niveles de seguridad adecuados mediante acuerdos contractuales.

---

## 9. Medidas de Seguridad

TIZA implementa las siguientes salvaguardas para proteger los datos personales:

**Técnicas:**
- Cifrado en tránsito mediante HTTPS/TLS en todas las comunicaciones.
- Cifrado en reposo en la infraestructura de Supabase.
- Políticas de Row Level Security (RLS) que garantizan el aislamiento de datos por usuario.
- Gestión segura de sesiones con tokens de corta duración.
- Separación de entornos de desarrollo y producción.

**Organizativas:**
- Acceso a los datos restringido al equipo de desarrollo estrictamente necesario.
- Compromisos de confidencialidad con los encargados del tratamiento (Supabase, Vercel).
- Revisión periódica de las configuraciones de seguridad de la base de datos.

**Ante incidentes:**
En caso de una brecha de seguridad que pueda afectar sus datos personales, TIZA se compromete a notificarle y a notificar a la Superintendencia de Industria y Comercio en los términos establecidos por la normativa aplicable.

---

## 10. Tiempo de Conservación de los Datos

| Categoría de dato | Período de conservación |
|-------------------|-----------------------|
| Perfil del usuario (nombre, email, institución) | Mientras la cuenta esté activa + 30 días hábiles tras solicitud de eliminación |
| Planes de lección | Mientras la cuenta esté activa + 30 días hábiles tras solicitud de eliminación |
| Logs de acceso y seguridad | Conforme a las políticas de Vercel y Supabase (generalmente 30-90 días) |
| Registros de solicitudes PQRS | 5 años a partir de la resolución, por exigencia legal |

---

## 11. Vigencia y Actualización de esta Política

Esta Política de Habeas Data entra en vigencia el **19 de mayo de 2026** y permanecerá vigente hasta su modificación o sustitución.

TIZA revisará este documento periódicamente para asegurar su conformidad con la normativa colombiana vigente y con las buenas prácticas internacionales de protección de datos. Las actualizaciones serán publicadas en la Plataforma con indicación de la fecha de la nueva versión.

---

## 12. Glosario Normativo

| Término | Definición (Ley 1581 de 2012) |
|---------|-------------------------------|
| Autorización | Consentimiento previo, expreso e informado del Titular para llevar a cabo el Tratamiento de datos personales. |
| Base de Datos | Conjunto organizado de datos personales que sea objeto de Tratamiento. |
| Dato Personal | Cualquier información vinculada o que pueda asociarse a una o varias personas naturales determinadas o determinables. |
| Dato Sensible | Dato que afecta la intimidad del Titular o cuyo uso indebido puede generar su discriminación. |
| Encargado | Persona natural o jurídica que realiza el Tratamiento de datos personales por cuenta del Responsable. |
| Responsable | Persona natural o jurídica que decide sobre la base de datos y/o el Tratamiento de los datos. |
| Titular | Persona natural cuyos datos personales sean objeto de Tratamiento. |
| Tratamiento | Cualquier operación sobre datos personales: recolección, almacenamiento, uso, circulación o supresión. |

---

*TIZA — Planeación pedagógica inteligente para docentes colombianos.*

*Este documento fue elaborado en cumplimiento de la Ley 1581 de 2012, el Decreto 1377 de 2013 y el Decreto Único Reglamentario 1074 de 2015 de la República de Colombia.*
