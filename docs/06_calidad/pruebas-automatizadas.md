# Pruebas Automatizadas

## Introducción

El proyecto TIZA cuenta con una suite de pruebas automatizadas que verifica el correcto funcionamiento de la lógica de negocio principal. Las pruebas están diseñadas para ejecutarse tanto en el entorno local del desarrollador como de forma automática en GitHub Actions cada vez que se sube código al repositorio.

---

## Herramientas utilizadas

El proyecto usa **Vitest** como framework de pruebas, elegido por su integración nativa con Vite (el bundler del proyecto) y su compatibilidad total con TypeScript sin configuración adicional.

---

## Estructura de las pruebas

Las pruebas están organizadas junto al código que verifican, siguiendo la convención `archivo.test.ts`:

```
app/src/
├── lib/
│   ├── db.ts
│   ├── db.test.ts              ← pruebas de base de datos
│   └── offlineQueue.test.ts   ← pruebas de cola offline
└── services/
    ├── aiService.ts
    └── aiService.test.ts      ← pruebas del servicio de IA
```

---

## Archivos de prueba

### `db.test.ts` — Capa de datos (9 pruebas)

Verifica las funciones que interactúan con Supabase para gestionar planes de clase y perfiles de usuario. Dado que estas funciones dependen de una base de datos real, se utiliza un **mock** (simulación) de Supabase para que las pruebas sean rápidas, predecibles y no requieran conexión a internet.

Las pruebas cubren:

- `saveLessonPlan()` — guardar un plan de clase y manejar errores de base de datos
- `getLessonPlans()` — obtener la lista de planes de un profesor
- `deleteLessonPlan()` — eliminar un plan correctamente
- `submitLessonPlanForReview()` — cambiar el estado de un plan a revisión pendiente
- `getProfile()` — obtener el perfil de un usuario, incluyendo el caso en que no existe

### `aiService.test.ts` — Servicio de generación de planes con IA (4 pruebas)

Verifica el servicio que se comunica con la función Edge de Supabase para generar planes de clase usando Gemini. Se simulan tanto la autenticación de Supabase como las llamadas HTTP mediante mocks, evitando consumir créditos reales de la API.

Las pruebas cubren:

- Que se lanza un error claro si el usuario no tiene sesión activa
- Que se retornan las ideas correctamente cuando la petición es exitosa
- Que se muestra un mensaje amigable cuando se alcanza el límite de generaciones (error 429)
- Que se maneja correctamente un error genérico del servidor (error 500)

### `offlineQueue.test.ts` — Cola de acciones offline (4 pruebas)

Verifica la lógica de la cola de acciones que permite al sistema funcionar sin conexión. Las operaciones fallidas se almacenan en IndexedDB y se reintentam automáticamente cuando el dispositivo recupera conectividad. Se simula IndexedDB para poder ejecutar estas pruebas en Node.js.

Las pruebas cubren:

- Que `drainQueue()` retorna cero operaciones si no hay una función de replay registrada
- Que las acciones pendientes se procesan y reportan como exitosas
- Que las acciones que superaron el límite de intentos (5) se descartan y cuentan como fallidas

---

## Mocks y simulaciones

Dado que el proyecto depende de servicios externos (Supabase, la API de Gemini e IndexedDB), las pruebas utilizan **mocks** para simular el comportamiento de estos servicios. Esto garantiza que:

- Las pruebas sean deterministas (siempre dan el mismo resultado)
- No se requiera conexión a internet ni credenciales reales
- La ejecución sea rápida (menos de 1 segundo para toda la suite)
- No se generen costos por uso de APIs externas durante el desarrollo

---

## Ejecución local

Para correr las pruebas en el entorno de desarrollo:

```bash
cd app
npm test
```

El resultado esperado es:

```
✓ src/lib/offlineQueue.test.ts  (4 tests)
✓ src/services/aiService.test.ts (4 tests)
✓ src/lib/db.test.ts             (9 tests)

Test Files  3 passed (3)
     Tests  17 passed (17)
```

---

## Automatización con GitHub Actions

Las pruebas se ejecutan automáticamente en GitHub Actions mediante el archivo `.github/workflows/test.yml`. Este workflow se activa en cada `push` o `pull request` a la rama principal, asegurando que ningún cambio rompa la funcionalidad existente sin que el equipo lo note.

El flujo de ejecución en GitHub es el siguiente:

1. GitHub descarga el código del repositorio
2. Instala Node.js 20 y las dependencias del proyecto
3. Ejecuta `npm test`
4. Reporta el resultado directamente en la interfaz del Pull Request

Si alguna prueba falla, GitHub bloquea el merge y notifica al desarrollador por correo, permitiendo corregir el problema antes de que llegue a producción.

---

## Resultados actuales

| Archivo | Pruebas | Estado |
|---|---|---|
| `db.test.ts` | 9 | ✅ Pasan |
| `aiService.test.ts` | 4 | ✅ Pasan |
| `offlineQueue.test.ts` | 4 | ✅ Pasan |
| **Total** | **17** | **✅ Todas pasan** |
