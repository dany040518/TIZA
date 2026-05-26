# Informe de QA Final — TIZA

## Introducción
Este informe presenta los resultados de las pruebas de calidad realizadas sobre la versión actual de la plataforma TIZA. El objetivo es validar la operatividad de los principales flujos funcionales y la estabilidad de la aplicación desde la perspectiva del usuario final.

## Alcance de la evaluación
- Autenticación y autorización de usuarios
- Funciones de gestión para docentes
- Funciones de revisión y aprobación para coordinadores
- Funciones administrativas para el administrador
- Gestión de perfil y cuenta
- Verificación del entorno de ejecución y la inicialización del sistema

## Metodología
Las pruebas se realizaron de forma manual sobre el entorno local con la aplicación desplegada desde el repositorio `TIZA/`. Los casos de prueba incluyeron escenarios positivos y negativos representativos de uso real.

## Entorno de prueba
- Aplicación ejecutada en `app/`
- Dependencias instaladas correctamente
- Variables de entorno presentes en `app/.env.local`
- Base de datos y esquema configurados según `supabase/migrations/20260507_init.sql`
- Cuentas de prueba utilizadas para roles de docente, coordinador y administrador

## Resultados ejecutivos
- Estado general: **Aprobado con observaciones**
- No se identificaron fallos críticos que impidan el uso de los flujos principales
- Se detectaron puntos de mejora en validación de datos y en algunos pasos del flujo de experiencia de usuario
- La mayoría de los módulos funcionan de forma consistente y estable

## Hallazgos clave
- La autenticación básica funciona correctamente para inicio de sesión, registro y recuperación de contraseña
- La autorización por roles garantiza el acceso adecuado a rutas protegidas
- El módulo docente opera en creación, edición y administración de planeaciones, clases, estudiantes y asistencia
- El módulo coordinador permite revisar, aprobar y rechazar planeaciones con trazabilidad clara
- El módulo administrador gestiona instituciones y códigos de invitación sin incidencias críticas
- La gestión de cuenta personal funciona correctamente y protege el acceso tras cierre de sesión

## Hallazgos identificados
- Registro: se permite un correo con formato incompleto como `example@example`.
- Registro: el placeholder de contraseña indica mínimo 8 caracteres, aunque el sistema acepta 6.
- Registro: no existe exigencia de una contraseña segura.
- Recuperación de contraseña: los correos válidos sin extensión de dominio tras el punto son rechazados incorrectamente.
- Cuenta: el campo de teléfono permite valores no válidos como `00`.
- Clases: cambiar la hora en la creación de clase genera un error `Invalid Value`.
- Planeación: después de guardar una planeación no hay un paso siguiente intuitivo.
- Planeación: no se puede vincular una planeación a una clase desde el flujo de planeación.
- Mis planeaciones: al descargar el PDF la app se congeló en una ocasión.
- Vista semanal: las clases no se reflejan en el calendario semanal como se espera.

## Validaciones destacadas
### 1. Arranque y entorno
- La aplicación se inicia correctamente con `corepack pnpm dev`
- Las variables de entorno necesarias se cargan sin errores
- El sistema no presenta fallos críticos durante la inicialización

### 2. Autenticación y acceso
- Login exitoso y redirecciones por rol configuradas
- Registro con invitación y manejo de errores de correo duplicado
- Recuperación de contraseña con confirmación de envío
- Accesos no autorizados correctamente bloqueados

### 3. Funcionalidad de docente
- Dashboard y navegación interna sin errores
- Planificación de sesiones con guardado y persistencia
- Listado y edición de planeaciones
- Gestión completa de clases y estudiantes
- Registro y actualización de asistencia
- Vista semanal operativa y consistente

### 4. Funcionalidad de coordinador
- Panel de revisiones cargado correctamente
- Aprobación y rechazo de planeaciones con actualización de estado
- Registro de comentarios de revisión

### 5. Funcionalidad de administrador
- Gestión de instituciones disponible
- Generación de códigos de invitación para docentes y coordinadores
- Eliminación de instituciones sin errores aparentes

### 6. Gestión de cuenta
- Visualización y edición del perfil de usuario
- Guardado de cambios de datos personales
- Cierre de sesión con redirección segura

### 7. No funcional
- Interfaz coherente y clara
- Mensajes de error visibles y comprensibles
- Responsividad adecuada en diferentes tamaños de pantalla
- Protección de rutas tras logout

## Conclusión
La versión evaluada de TIZA presenta una base sólida para el uso funcional de sus principales módulos. Los flujos de docentes, coordinadores y administradores operan correctamente, pero se recomienda corregir los hallazgos identificados antes de avanzar con un despliegue comercial definitivo.

## Recomendaciones
- Corregir las validaciones de correo, contraseña y teléfono para asegurar coherencia y seguridad.
- Ajustar la experiencia posterior al guardado de planeaciones y habilitar la vinculación a clases.
- Revisar el error de hora en la creación de clases y el comportamiento de descarga de PDF.
- Verificar la sincronización de datos en la vista semanal para que las clases se muestren correctamente.
- Mantener la configuración de variables de entorno en entornos de producción y preproducción.
- Realizar pruebas adicionales con datos reales de instituciones y usuarios antes del despliegue definitivo.
- Considerar pruebas de rendimiento y carga en una próxima fase para validar escalabilidad.

## Rutas evaluadas
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/`
- `/dashboard`
- `/planning`
- `/my-plans`
- `/classes`
- `/weekly`
- `/classes/:classId/students`
- `/classes/:classId/attendance`
- `/coordinator`
- `/admin`
- `/account`
