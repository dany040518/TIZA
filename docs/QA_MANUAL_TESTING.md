# Pruebas QA Manuales — TIZA

## Resumen
Este documento registra la ejecución de pruebas manuales sobre la plataforma TIZA. Todas las pruebas planificadas se ejecutaron y aprobaron correctamente según el flujo de usuario definido en la aplicación.

## Alcance
- Flujo de autenticación y autorización
- Funcionalidad de docentes: planificación, planeaciones, clases, estudiantes, asistencia y vista semanal
- Funcionalidad de coordinadores: revisión, aprobación y rechazo de planeaciones
- Funcionalidad de administradores: creación de instituciones e invitaciones
- Gestión de cuenta y perfil
- Verificación de arranque y variables de entorno

## Entorno de prueba
- Repositorio local disponible en `TIZA/`
- Dependencias instaladas en `app/`
- Variables de entorno definidas en `app/.env.local`
- Supabase configurado con el esquema de `supabase/migrations/20260507_init.sql`
- Cuentas de prueba para roles: docente, coordinador y admin

## Resultados generales
- Estado: **Aprobado**
- Las pruebas manuales cubrieron los escenarios principales de uso del producto.
- No se encontraron fallos críticos en los flujos verificados.

## Observaciones previas
- La aplicación depende de las variables de entorno de Supabase en `app/src/lib/supabaseClient.ts`.
- Si `VITE_SUPABASE_URL` o `VITE_SUPABASE_ANON_KEY` faltan, la app falla en el arranque.
- El comando recomendado para iniciar el entorno local es `corepack pnpm dev` dentro de `app/`.

---

## 1. Entorno y arranque
### 1.1 Validación de inicio
- El servidor local arrancó correctamente con `corepack pnpm dev`.
- La aplicación se cargó sin errores de renderizado en el navegador.
- No se presentó el error `Missing Supabase environment variables`.

### 1.2 Variables de entorno
- `app/.env.local` contiene valores válidos para:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_GEMINI_API_KEY`
- La aplicación tomó correctamente estas variables en tiempo de ejecución.

---

## 2. Autenticación
### 2.1 Inicio de sesión
- Se verificó el flujo de `/login`.
- Con credenciales válidas de docente, la sesión se inició con éxito.
- El sistema redirigió correctamente a `/dashboard`.
- Los errores de credenciales inválidas se mostraron de forma clara.
- El botón de visibilidad de contraseña funcionó correctamente.
- El enlace `¿Olvidaste la contraseña?` llevó a `/forgot-password`.

### 2.2 Registro
- Se verificó el flujo de `/register`.
- Un código de invitación inválido mostró el mensaje de error esperado.
- Un código válido permitió avanzar al formulario de datos.
- El registro creó la cuenta correctamente.
- El sistema detectó correos duplicados y mostró una advertencia adecuada.
- El enlace `Ya tengo cuenta` retorna al login.

### 2.3 Recuperación de contraseña
- Se verificó `/forgot-password`.
- El correo registrado aceptó la solicitud de recuperación.
- El flujo mostró confirmación de envío.

### 2.4 Redirecciones por rol
- `/` redirigió a `/login` para usuarios no autenticados.
- Docentes fueron enviados a `/dashboard`.
- Coordinadores fueron enviados a `/coordinator`.
- Administradores fueron enviados a `/admin`.

---

## 3. Autorización
### 3.1 Rutas protegidas
- Las rutas docentes (`/dashboard`, `/planning`, `/my-plans`, `/classes`, `/weekly`, `/classes/:classId/students`, `/classes/:classId/attendance`) requieren autenticación.
- Las rutas docentes no son accesibles por coordinador o admin sin el rol adecuado.
- `/account` es accesible para cualquier usuario autenticado.
- El sistema de redirecciones respetó el rol del usuario.

---

## 4. Funcionalidad de docente
### 4.1 Dashboard
- El dashboard de docente cargó correctamente.
- Las opciones de navegación a las funcionalidades principales estuvieron disponibles.
- El contenido principal se mostró sin errores.

### 4.2 Planificación
- Se verificó `/planning`.
- Se completaron los campos de tema, área, grado y contexto.
- La generación de ideas se ejecutó y se mostraron resultados.
- La selección de ideas habilitó el panel de planeación.
- La función de guardado de planeación devolvió estado de éxito.
- Los campos opcionales persistieron correctamente.

### 4.3 Mis planeaciones
- Se verificó `/my-plans`.
- La lista de planeaciones se cargó correctamente.
- El filtrado por estado funcionó.
- La visualización de detalles resultó correcta.
- La exportación a PDF generó el archivo esperado.
- La edición y guardado de planeaciones funcionaron.
- La vinculación a clase y el envío a revisión se comportaron como se esperaba.

### 4.4 Clases
- Se verificó `/classes`.
- La creación de nuevas clases fue exitosa.
- La edición de clases funcionó.
- El archivado, desarchivado y eliminación trabajaron correctamente.
- La navegación hacia estudiantes y asistencia desde una clase fue correcta.

### 4.5 Estudiantes
- Se verificó `/classes/:classId/students`.
- La creación manual de estudiantes funcionó.
- La edición de datos se guardó correctamente.
- La eliminación actualizó la lista.
- La plantilla CSV se descargó sin problemas.
- La importación de CSV válida mostró preview y cargó los estudiantes.
- CSV inválidos arrojaron mensajes de error descriptivos.

### 4.6 Asistencia
- Se verificó `/classes/:classId/attendance`.
- El listado de estudiantes cargó correctamente.
- El cambio de fecha actualizó la asistencia.
- Se marcaron estados de asistencia y se guardaron.
- El resumen de asistencia se actualizó correctamente.

### 4.7 Vista semanal
- Se verificó `/weekly`.
- La vista semanal mostró el horario.
- Los controles `Anterior`, `Siguiente` y `Hoy` funcionaron.
- Las clases se ubicaron en los días y horas correctos.

---

## 5. Funcionalidad de coordinador
### 5.1 Panel de coordinador
- Se verificó `/coordinator`.
- Las planeaciones pendientes se cargaron correctamente.
- El filtrado por estado funcionó.
- La expansión del detalle mostró la información esperada.
- La aprobación y el rechazo actualizaron el estado de la planeación.
- El comentario de revisión se registró correctamente.

---

## 6. Funcionalidad de administrador
### 6.1 Panel de administrador
- Se verificó `/admin`.
- La lista de instituciones se cargó.
- La creación de institución fue exitosa.
- Los códigos de invitación de docente y coordinador se generaron.
- La eliminación de institución funcionó correctamente.

---

## 7. Gestión de cuenta
### 7.1 Perfil
- Se verificó `/account`.
- El perfil y los datos de cuenta se cargaron.
- La edición de nombre, teléfono y área de especialidad guardó los cambios.
- El rol y correo se muestran correctamente.
- El cierre de sesión redirige a `/login`.

---

## 8. Verificaciones no funcionales
### 8.1 Experiencia de usuario
- Botones, enlaces y formularios se visualizan correctamente.
- Los estados de carga se muestran al obtener o guardar datos.
- Los mensajes de error son claros y visibles.

### 8.2 Responsividad
- Las pantallas principales se probaron en desktop, tablet y móvil.
- La interfaz se adapta de forma adecuada a pantallas más pequeñas.

### 8.3 Seguridad y acceso
- Las rutas protegidas no son accesibles tras el logout.
- Las acciones sensibles requieren autenticación.
- Las redirecciones por rol se comportan correctamente.

---

## 9. Conclusión
Las pruebas manuales realizadas sobre la versión actual de TIZA mostraron un comportamiento estable en los principales flujos del producto. Los escenarios clave de docentes, coordinadores y administradores están operativos y aprobados.

---

## Rutas comprobadas
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
