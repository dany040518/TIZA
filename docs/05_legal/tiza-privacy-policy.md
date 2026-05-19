# Política de Privacidad — TIZA

**Última actualización:** 19 de mayo de 2026
**Versión:** 1.0

---

## 1. Identificación del Responsable del Tratamiento

**TIZA** es una aplicación web progresiva (PWA) de planeación pedagógica asistida por inteligencia artificial, desarrollada y operada por su(s) creador(es) (en adelante, "el Responsable" o "TIZA").

Para ejercer sus derechos o presentar consultas relacionadas con el tratamiento de sus datos personales, puede contactarnos a través del canal habilitado en la aplicación o al correo electrónico indicado en la sección de contacto de este documento.

> **Nota:** TIZA cumple con las disposiciones de la Ley 1581 de 2012 (Ley de Protección de Datos Personales), el Decreto 1377 de 2013, el Decreto Único Reglamentario 1074 de 2015 y las demás normas concordantes vigentes en Colombia.

---

## 2. Definiciones

Para efectos de esta Política, se entiende por:

- **Dato personal:** cualquier información vinculada o que pueda asociarse a una o varias personas naturales determinadas o determinables.
- **Titular:** persona natural cuyos datos personales son objeto de tratamiento.
- **Responsable:** persona o entidad que decide sobre la base de datos y el tratamiento.
- **Encargado:** persona o entidad que realiza el tratamiento por cuenta del Responsable.
- **Tratamiento:** cualquier operación sobre datos personales (recolección, almacenamiento, uso, circulación, supresión, entre otras).
- **Dato sensible:** datos que afectan la intimidad del titular o cuyo uso puede generar discriminación.

---

## 3. Datos Personales que Recopilamos

### 3.1 Datos del usuario registrado (docente)

| Categoría | Dato | Fuente |
|-----------|------|--------|
| Identificación | Nombre completo | Registro propio del usuario |
| Contacto | Correo electrónico | Registro propio del usuario |
| Institución | Nombre de la institución educativa | Registro propio del usuario |
| Rol | Rol en la plataforma (docente) | Asignación automática al registrarse |
| Técnico | Identificador único de sesión (UUID) | Generado por el sistema de autenticación |

### 3.2 Datos de uso y contenido académico

| Categoría | Dato | Fuente |
|-----------|------|--------|
| Contenido | Planes de lección creados (asignatura, grado, tema, objetivos, materiales, secuencia didáctica) | Ingresados por el usuario |
| Técnico | Fecha y hora de creación de registros | Generados automáticamente |

### 3.3 Datos que NO recopilamos

TIZA **no** recopila directamente:

- Nombres de estudiantes menores de edad como dato identificable independiente.
- Números de documento de identidad.
- Datos financieros o de tarjetas de crédito.
- Datos de salud o datos sensibles según el artículo 5 de la Ley 1581 de 2012.
- Números de teléfono.
- Ubicación geográfica en tiempo real.

---

## 4. Finalidad del Tratamiento

Los datos recopilados por TIZA se utilizan exclusivamente para las siguientes finalidades:

1. **Prestación del servicio:** permitir el acceso, autenticación y uso de las funcionalidades de la plataforma de planeación pedagógica.
2. **Personalización:** asociar los planes de lección al perfil del docente para que pueda consultarlos y gestionarlos.
3. **Mejora del servicio:** analizar el uso de la plataforma de forma agregada y no individualizada para identificar oportunidades de mejora.
4. **Seguridad:** verificar la identidad del usuario y proteger la integridad de la plataforma.
5. **Cumplimiento legal:** atender requerimientos de autoridades competentes cuando así lo exija la ley colombiana.

TIZA **no** utilizará sus datos para:

- Venta o cesión de datos a terceros con fines comerciales.
- Publicidad dirigida o perfilamiento comercial.
- Usos distintos a los aquí declarados sin su autorización previa.

---

## 5. Almacenamiento y Ubicación de los Datos

Los datos son almacenados en **Supabase**, plataforma de base de datos como servicio (DBaaS) basada en PostgreSQL. Los servidores pueden estar ubicados en los Estados Unidos u otras regiones según la configuración del proyecto en Supabase.

Al aceptar esta Política, el Titular autoriza expresamente la **transferencia internacional de datos** hacia los servidores de Supabase, en cumplimiento del artículo 26 de la Ley 1581 de 2012, dado que dicha transferencia es necesaria para la ejecución del contrato de prestación del servicio.

### 5.1 Tiempo de retención

- Los datos del perfil y los planes de lección se conservan **mientras el usuario mantenga una cuenta activa** en TIZA.
- Cuando el usuario solicite la eliminación de su cuenta, los datos serán eliminados en un plazo máximo de **30 días hábiles**, salvo que una obligación legal exija su conservación por un período mayor.

---

## 6. Seguridad de los Datos

TIZA implementa las siguientes medidas técnicas y organizativas para proteger sus datos:

- **Autenticación segura:** gestión de sesiones a través del sistema de autenticación de Supabase, con soporte para autenticación mediante correo electrónico y contraseña, y opcionalmente con Google OAuth.
- **Cifrado en tránsito:** toda la comunicación entre su dispositivo y los servidores utiliza el protocolo HTTPS/TLS.
- **Cifrado en reposo:** Supabase cifra los datos almacenados en sus infraestructuras.
- **Control de acceso (RLS):** se aplican políticas de Row Level Security (RLS) en la base de datos, garantizando que cada usuario solo pueda acceder a sus propios datos.
- **Aislamiento de datos:** los planes de lección y perfiles están vinculados a identificadores únicos de usuario; ningún docente puede acceder a la información de otro.

A pesar de estas medidas, ningún sistema es completamente infalible. En caso de un incidente de seguridad que afecte sus datos, TIZA se compromete a notificarle dentro del término establecido por la normativa aplicable.

---

## 7. Servicios de Terceros Utilizados

TIZA utiliza los siguientes servicios de terceros para su funcionamiento. Al usar la plataforma, acepta que sus datos puedan ser procesados por estos proveedores bajo sus propias políticas de privacidad:

| Proveedor | Rol | Datos involucrados | Política de privacidad |
|-----------|-----|--------------------|------------------------|
| **Supabase** | Base de datos y autenticación | Perfil, credenciales, planes de lección | [supabase.com/privacy](https://supabase.com/privacy) |
| **Google (Gemini API)** | Generación de contenido con IA | Prompts de planeación de clase (sin datos de identificación personal) | [policies.google.com/privacy](https://policies.google.com/privacy) |
| **Vercel** | Alojamiento y despliegue de la aplicación | Datos técnicos de acceso (IP, agente de usuario, logs de red) | [vercel.com/legal/privacy-policy](https://vercel.com/legal/privacy-policy) |
| **Google OAuth** *(opcional)* | Autenticación con cuenta Google | Nombre, correo electrónico de la cuenta Google | [policies.google.com/privacy](https://policies.google.com/privacy) |

TIZA no controla las prácticas de privacidad de estos terceros y les exige contractualmente que traten los datos con niveles de seguridad adecuados.

---

## 8. Cookies y Almacenamiento Local

TIZA utiliza las siguientes tecnologías de almacenamiento en el navegador:

### 8.1 Cookies de sesión

Supabase utiliza cookies o tokens almacenados en el navegador para mantener la sesión autenticada del usuario. Estas cookies son **estrictamente necesarias** para el funcionamiento de la plataforma y no requieren consentimiento independiente, conforme a la normativa aplicable.

### 8.2 Almacenamiento local (localStorage / Cache API)

Como PWA, TIZA puede almacenar en su dispositivo:

- Recursos de la aplicación (código, estilos, imágenes) para permitir el acceso sin conexión.
- Datos de sesión locales para mejorar el rendimiento.

Estos datos son almacenados únicamente en su dispositivo y bajo su control. Puede eliminarlos en cualquier momento desde la configuración de su navegador.

### 8.3 Ausencia de cookies de rastreo publicitario

TIZA **no** utiliza cookies de seguimiento, cookies de terceros con fines publicitarios ni tecnologías similares de rastreo entre sitios.

---

## 9. Derechos del Titular

De conformidad con los artículos 8 y 21 de la Ley 1581 de 2012, usted tiene los siguientes derechos:

| Derecho | Descripción |
|---------|-------------|
| **Conocer** | Acceder gratuitamente a sus datos personales que han sido objeto de tratamiento. |
| **Actualizar** | Solicitar la actualización de datos inexactos, incompletos o fragmentados. |
| **Rectificar** | Corregir datos que no correspondan a la realidad. |
| **Suprimir** | Solicitar la eliminación de sus datos cuando no exista un deber legal o contractual de conservarlos. |
| **Revocar** | Revocar la autorización otorgada para el tratamiento de sus datos. |
| **Reclamar** | Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) si considera que sus derechos han sido vulnerados. |

Para ejercer cualquiera de estos derechos, consulte la sección **10. Contacto y Procedimiento** de este documento.

---

## 10. Contacto y Procedimiento para el Ejercicio de Derechos

Para consultas, peticiones, quejas y reclamos relacionados con el tratamiento de sus datos personales, puede:

- Usar el canal de reporte disponible dentro de la aplicación TIZA.
- Escribir al correo electrónico de contacto indicado en la sección de soporte de la aplicación.

**Proceso:**

1. Presente su solicitud identificándose como titular del dato y describiendo claramente su petición.
2. TIZA le responderá en un plazo máximo de **10 días hábiles** para consultas y **15 días hábiles** para reclamos, conforme al artículo 14 de la Ley 1581 de 2012.
3. Si su solicitud requiere más tiempo, se le notificará antes del vencimiento del plazo.

Si no obtiene respuesta satisfactoria, puede presentar una queja ante la **Superintendencia de Industria y Comercio (SIC)**: [www.sic.gov.co](https://www.sic.gov.co)

---

## 11. Modificaciones a esta Política

TIZA se reserva el derecho de modificar esta Política de Privacidad en cualquier momento. Los cambios serán comunicados mediante:

- Publicación de la nueva versión en la aplicación con la fecha de actualización visible.
- Notificación al correo electrónico registrado cuando los cambios sean sustanciales.

El uso continuado de la plataforma tras la publicación de modificaciones implica la aceptación de la nueva versión.

---

## 12. Ley Aplicable y Jurisdicción

Esta Política se rige por las leyes de la República de Colombia, en particular por la Ley 1581 de 2012 y sus decretos reglamentarios. Cualquier controversia será resuelta ante los jueces competentes de la ciudad de Bogotá D.C., Colombia.

---

*TIZA — Planeación pedagógica inteligente para docentes colombianos.*
