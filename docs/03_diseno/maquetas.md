# Maquetas y Sistema de Diseño — TIZA

---

## Herramienta de diseño

Las maquetas de TIZA fueron diseñadas en **Figma**.

> **Enlace al archivo Figma:** *(agregar enlace cuando esté disponible para compartir)*

---

## Sistema de diseño implementado

El sistema de diseño está documentado en detalle en [`TIZA_CREATIVE_DIRECTION.md`](TIZA_CREATIVE_DIRECTION.md) y está **completamente implementado** en el código de producción (`app/src/index.css`).

### Paleta de colores (OKLCH)

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-cream` | `oklch(0.975 0.022 85)` | Fondo principal |
| `--color-paper` | `oklch(0.99 0.012 85)` | Superficies de cards |
| `--color-plum` | `oklch(0.24 0.06 340)` | Texto principal, bordes |
| `--color-orange` | `oklch(0.7 0.19 38)` | Acento primario, CTA |
| `--color-blush` | `oklch(0.91 0.06 350)` | Tag "Panel" |
| `--color-butter` | `oklch(0.9 0.13 95)` | Tag "Planeación" |
| `--color-mint` | `oklch(0.88 0.08 155)` | Tag "Mis Planes" / éxito |
| `--color-lilac` | `oklch(0.85 0.07 305)` | Tag "Clases" |
| `--color-mute` | `oklch(0.5 0.04 340)` | Texto secundario |

### Tipografía

| Variable | Fuente | Uso |
|----------|--------|-----|
| `--font-sans` | Plus Jakarta Sans | Cuerpo, UI, labels |
| `--font-serif` | Newsreader (italic) | Énfasis decorativo en headings |
| `--font-hand` | Caveat | Detalles manuscritos (logo) |
| `--font-mono` | JetBrains Mono / system | Código, datos técnicos |

### Componentes base

| Clase | Descripción |
|-------|-------------|
| `.sticker` | Card con borde plum, sombra chunky 4px |
| `.btn-chunky` | Botón pill con sombra desplazada, efecto hover lift |
| `.btn-chunky-primary` | Botón primario naranja |
| `.chip` | Etiqueta inline con borde |
| `.label` | Small caps uppercase 12px |
| `.serif-em` | Span de énfasis serif itálico |
| `.font-display` | Heading ExtraBold, tracking −0.03em |

### Radios

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-sm` | 10px | Chips pequeños |
| `--radius-md` | 16px | Inputs |
| `--radius-lg` | 24px | Cards (sticker) |
| `--radius-xl` | 32px | Modales |
| `--radius-pill` | 999px | Botones, chips |

---

## Pantallas principales

### Login y Register
- Fondo con gradientes radiales suaves en las 4 esquinas
- Logo TIZA centrado con tipografía Caveat
- Formulario como card `.sticker`
- Botón "Continuar" como `.btn-chunky-primary`

### Dashboard (docente)
- Grid 1 columna (móvil) / 2 columnas `1fr 360px` (desktop)
- Tarjetas de tareas con color de acento por contexto
- Calendario semanal con día actual resaltado en naranja
- Greeting personalizado con nombre del docente

### Planning (planeación con IA)
- Paso 1: textarea grande para describir la sesión
- Paso 2: 3 tarjetas de ideas generadas (seleccionable)
- Paso 3: formulario detallado editable por secciones
- Barra inferior con botones guardar / enviar a revisión

### Attendance (asistencia)
- Lista de estudiantes con número de orden
- 4 botones de estado por fila: Presente / Ausente / Tarde / Excusado
- Barra de resumen con conteo por estado al tope
- Date picker integrado en el header

### Layout móvil
- Bottom navigation bar fija con emoji + label por tab
- Avatar de cuenta accesible en top-right
- Banner de estado offline cuando no hay conexión

---

## Pruebas con usuarios

| Sesión | Participantes | Método | Hallazgos principales |
|--------|--------------|--------|----------------------|
| Sesión 1 (prototipo papel) | 3 docentes | Think-aloud | El registro de asistencia debe ser < 3 pasos; el nombre "Planeación" no era intuitivo (preferían "Mis Clases") |
| Sesión 2 (prototipo Figma) | 4 docentes | Test de usabilidad 5s | Logo TIZA reconocible; confusión entre "Mis Planes" y "Planeación" resuelta con emojis diferenciadores |
| Sesión 3 (app desplegada) | 5 docentes piloto | Observación + cuestionario SUS | Score SUS promedio: 78/100 · Tarea más rápida: asistencia (52 s) · Tarea más lenta: importación CSV (4 min) |

> **Nota:** agregar capturas de pantalla de sesiones cuando estén disponibles.

---

*TIZA · Maquetas y Sistema de Diseño · v1.0 · 2026*