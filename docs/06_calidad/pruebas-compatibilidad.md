# Pruebas de Compatibilidad — TIZA

---

## Matriz de navegadores y dispositivos

Los 5 flujos críticos se prueban en cada combinación:

| Flujo | Descripción |
|-------|-------------|
| F1 — Registro y login | Crear cuenta, iniciar sesión, cerrar sesión |
| F2 — Crear clase e importar estudiantes | Crear clase, subir CSV, ver lista |
| F3 — Registro de asistencia | Navegar a clase, marcar 5 estudiantes, guardar |
| F4 — Planeación con IA | Completar formulario, generar ideas, guardar plan |
| F5 — Exportar PDF | Abrir plan guardado, exportar como PDF |

---

### Resultados — Desktop

| Navegador | Versión probada | F1 | F2 | F3 | F4 | F5 | Estado |
|-----------|----------------|----|----|----|----|-----|--------|
| Chrome (Windows) | 124+ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ OK |
| Firefox (Windows) | 125+ | ✅ | ✅ | ✅ | ✅ | ⚠️* | ⚠️ Parcial |
| Safari (macOS) | 17+ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ OK |
| Edge (Windows) | 124+ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ OK |

*\* Firefox: la descarga del PDF abre en una nueva pestaña en lugar de descarga directa. No bloqueante.*

---

### Resultados — Móvil

| Dispositivo | SO / Browser | Resolución | F1 | F2 | F3 | F4 | F5 | Estado |
|-------------|-------------|-----------|----|----|----|----|-----|--------|
| Samsung Galaxy A14 | Android 13 / Chrome | 360×800 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ OK |
| iPhone 13 | iOS 17 / Safari | 390×844 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ OK |
| Motorola Moto G | Android 12 / Chrome | 360×760 | ✅ | ⚠️** | ✅ | ✅ | ✅ | ⚠️ Parcial |
| iPad (9.ª gen.) | iPadOS 16 / Safari | 810×1080 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ OK |
| Tablet Android 8" | Android 11 / Chrome | 800×1280 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ OK |

*\*\* Moto G: el selector de archivos CSV tarda ~3 s en abrirse (hardware limitado). Funcional, no bloqueante.*

---

### Resoluciones críticas

| Resolución | Contexto | Estado | Observaciones |
|------------|---------|--------|---------------|
| 320px (iPhone SE 1.ª gen.) | Móvil mínimo | ✅ | Bottom nav funcional; tabs en emojis sin overflow |
| 360px (Android gama media) | Móvil más común Colombia | ✅ | Flujo principal sin scroll horizontal |
| 768px (tablet) | iPad mini / tablets | ✅ | Layout intermedio, sin bottom nav |
| 1280px (laptop) | Portátil docente | ✅ | Grids 2 columnas activos |
| 1440px+ (desktop) | — | ✅ | max-width 1320px centra el contenido |

---

## Pruebas offline

| Escenario | Resultado |
|-----------|-----------|
| Registrar asistencia sin internet | ✅ Se guarda en IndexedDB |
| Reconexión automática y sync | ✅ drainQueue() ejecuta en evento `online` |
| Banner de estado offline visible | ✅ Aparece en amarillo en todos los layouts |
| Banner de sincronización pendiente | ✅ Aparece en verde mientras hay acciones en cola |

---

## Pruebas de carga

Ver scripts en [`load-tests/`](../../load-tests/) y workflow en [`.github/workflows/load-test.yml`](../../.github/workflows/load-test.yml).

| Test | Configuración | Resultado último run |
|------|--------------|----------------------|
| Smoke test | 1 VU · 30 s | — *(ejecutar manualmente en GitHub Actions)* |
| Load test | 50 VU · 2 min ramp | — *(ejecutar manualmente en GitHub Actions)* |

---

## Checklist de errores visuales

| Elemento | 320px | 768px | 1280px |
|----------|-------|-------|--------|
| Header — no scroll horizontal | ✅ | ✅ | ✅ |
| Nav — bottom bar en móvil | ✅ | N/A | N/A |
| Nav — tabs top en desktop | N/A | ✅ | ✅ |
| Modales — no salen de pantalla | ✅ | ✅ | ✅ |
| Tablas de estudiantes — scroll horizontal contenido | ✅ | ✅ | ✅ |
| Formularios — inputs sin overflow | ✅ | ✅ | ✅ |
| Botones — mínimo 44×44px touch target | ✅ | ✅ | ✅ |
| Texto — legible sin zoom | ✅ | ✅ | ✅ |

---

## Herramientas usadas

- **Chrome DevTools** — simulación de dispositivos y throttling de red
- **BrowserStack** (trial) — pruebas en iOS físico
- **Dispositivos físicos** — Samsung A14, Moto G, MacBook Pro

---

*TIZA · Pruebas de Compatibilidad · v1.0 · 2026*