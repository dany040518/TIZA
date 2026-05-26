# Plan de Pruebas Manuales — TIZA

## URL de prueba
- App desplegada: https://tiza-h2tn.vercel.app/login

## Objetivo
Seguir un plan de pruebas manuales estructurado que cubra los flujos principales de usuario, desde inicio de sesión hasta las funciones de docente, coordinador y administrador.

## Preparación
- [Pass] Confirmar acceso a la app desplegada en https://tiza-h2tn.vercel.app/login
- [Pass] Contar con credenciales de prueba para:
  - Docente
  - Coordinador
  - Admin
- [Pass] Tener a la mano códigos de invitación o datos de institución si es necesario para registro
- [Pass] Tener una hoja o herramienta para registrar resultados y observaciones

## Checklist de pruebas

### 1. Autenticación
- [Pass] Abrir la URL de login.
- [Pass] Ingresar credenciales válidas de docente.
- [Pass] Verificar que el login es exitoso y redirige al dashboard.
- [Pass] Ingresar credenciales inválidas y confirmar mensaje de error.
- [Pass] Probar el botón de mostrar/ocultar contraseña.
- [Fail] Probar el enlace `¿Olvidaste la contraseña?`.

### 2. Registro de usuario
- [Pass] Abrir `/register` desde el login.
- [Pass] Ingresar un código de invitación inválido y verificar mensaje de error.
- [Pass] Ingresar un código de invitación válido y avanzar al formulario.
- [Pass] Completar el registro con nombre, correo y contraseña.
- [Pass] Confirmar que la cuenta se crea o avisa correctamente.
- [Pass] Verificar que el enlace `Ya tengo cuenta` regresa al login.

### 3. Flujos por rol
#### Docente
- [Pass] Confirmar que al iniciar sesión el docente ve el dashboard.
- [Pass] Navegar a `/dashboard`, `/planning`, `/my-plans`, `/classes`, `/weekly`.
- [Pass] Confirmar que cada página carga y muestra contenido.

#### Coordinador
- [Pass] Iniciar sesión con cuenta de coordinador.
- [Pass] Confirmar acceso a `/coordinator`.
- [Pass] Verificar que se cargan planeaciones pendientes.
- [Pass] Probar filtros de estado: Por revisar / Aprobados / Rechazados / Todos.
- [Pass] Aprobar y rechazar una planeación y confirmar cambios.

### 4. Funciones del docente
#### Planificación
- [Pass] Abrir `/planning`.
- [Pass] Completar tema, área, grado y contexto.
- [Pass] Generar ideas.
- [Pass] Seleccionar una idea y revisar la planeación.
- [Pass] Guardar la planeación.

#### Mis planeaciones
- [Pass] Abrir `/my-plans`.
- [Pass] Verificar la carga de planeaciones.
- [Pass] Aplicar filtro por estado.
- [Pass] Abrir detalle de una planeación.
- [Pass] Descargar PDF.
- [Pass] Editar una planeación y guardar.
- [Pass] Enviar una planeación a revisión.

#### Clases
- [Pass] Abrir `/classes`.
- [Pass] Crear una clase nueva con nombre, materia y nivel.
- [Pass] Editar una clase existente.
- [Pass] Archivar/desarchivar una clase.
- [Pass] Eliminar una clase.
- [Fail] Acceder a la vista de estudiantes y asistencia desde la clase.

#### Vista semanal
- [Pass] Abrir `/weekly`.
- [Pass] Verificar la visualización del horario semanal.
- [Pass] Probar botones `Anterior`, `Siguiente` y `Hoy`.

### 5. Cuenta y perfil
- [Pass] Abrir `/account`.
- [Pass] Confirmar carga de datos del usuario.
- [Pass] Editar nombre, teléfono y área de especialidad.
- [Pass] Guardar cambios.
- [Pass] Cerrar sesión y verificar redirección a login.

### 6. Pruebas adicionales
- [Pass] Probar que las rutas protegidas no son accesibles sin sesión.
- [Pass] Verificar mensajes de error en operaciones fallidas.
- [Pass] Validar que la app se vea aceptable en mobile/tablet.

## Hallazgos adicionales detectados
- Registro: se permite crear un correo con formato incompleto como `example@example`.
- Registro: el placeholder de contraseña indica mínimo 8 caracteres, aunque el sistema acepta 6.
- Registro: no hay exigencia de una contraseña segura mínima.
- Recuperar contraseña: un correo válido sin extensión después del punto (por ejemplo `example@example`) se considera inválido para recuperación, aunque la cuenta funciona.
- Cuenta: el campo de teléfono permite valores no válidos como `00`.
- Clases: al crear una clase nueva, modificar la hora produce error `Invalid Value`.
- Planeación: después de guardar una planeación no existe un paso siguiente intuitivo.
- Planeación: no se puede vincular una planeación a una clase desde el flujo de guardado.
- Mis planes: al descargar PDF la app se congeló en una ocasión.
- Vista semanal: las clases no se reflejan en la vista semanal.

## Cómo reportar resultados
Para cada ítem, registra:
- Estado: `Pass` / `Fail`
- Observaciones
- URL o paso específico si aplica
- Captura de pantalla si el error es visible

## Prioridad de pruebas
1. Login y registro
2. Rutas protegidas y roles
3. Flujo de planificación de docentes
4. Revisión de coordinador
5. Creación de instituciones por admin
6. Gestión de estudiantes y asistencia

## Conclusión
Este plan sirve como guía paso a paso para validar la app desplegada en https://tiza-h2tn.vercel.app/login. Si detectas fallos, documenta el paso exacto y el resultado esperado versus el actual.
