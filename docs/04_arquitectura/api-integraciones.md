# Endpoints, APIs e Integraciones — TIZA

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React + TypeScript | 19.x / 5.8 |
| Build tool | Vite + vite-plugin-pwa | 6.4 / 1.3 |
| Estilos | Tailwind CSS v4 | 4.x |
| Routing | React Router DOM | 7.x |
| Backend / DB | Supabase (PostgreSQL 15 + Auth) | 2.x SDK |
| IA generativa | Google Gemini 2.0 Flash | @google/genai 1.x |
| PDF export | html2pdf.js + html2canvas | 0.14 / 1.4 |
| Animaciones | Motion (Framer Motion v12) | 12.x |
| Despliegue | Vercel (SPA + edge network) | — |
| CI/CD | GitHub Actions | — |

---

## Variables de entorno

| Variable | Descripción | Requerida | Dónde se usa |
|----------|-------------|----------|-------------|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase | ✅ | `supabaseClient.ts` |
| `VITE_SUPABASE_ANON_KEY` | Clave pública (anon) de Supabase | ✅ | `supabaseClient.ts` |
| `VITE_GEMINI_API_KEY` | API Key de Google AI Studio | ✅ | `aiService.ts` |

> **Archivo local:** `app/.env.local` (no commiteado).  
> **Producción:** configuradas en Variables de entorno de Vercel.  
> **CI:** configuradas como Secrets de GitHub (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_GEMINI_API_KEY`).

---

## Integración 1 — Supabase

### Auth
| Función | Método Supabase | Descripción |
|---------|----------------|-------------|
| Registro email | `supabase.auth.signUp()` | Crea usuario + dispara trigger `handle_new_user` |
| Login email | `supabase.auth.signInWithPassword()` | Sesión JWT |
| Login Google | `supabase.auth.signInWithOAuth({ provider: 'google' })` | OAuth 2.0 PKCE |
| Logout | `supabase.auth.signOut()` | Invalida JWT |
| Sesión activa | `supabase.auth.getSession()` | Usado en `useAuth.ts` |
| Perfil usuario | `supabase.auth.getUser()` | Usado en `errorMonitor.ts` |

### Base de datos (PostgreSQL con RLS)

| Tabla | Descripción | Políticas RLS |
|-------|-------------|---------------|
| `app_users` | Perfil extendido del usuario (nombre, rol, institución, etc.) | Owner full access |
| `institutions` | Instituciones educativas creadas por admin | Admin write, authenticated read |
| `invite_codes` | Códigos de invitación por institución | Admin write, authenticated validate |
| `classes` | Clases creadas por docentes | Owner (teacher_id) |
| `class_students` | Tabla pivot clase ↔ estudiante (M:M) | Owner via class |
| `students` | Estudiantes de la institución del docente | Institution-scoped |
| `attendance` | Registros de asistencia | Owner (teacher_id) |
| `lesson_plans` | Planeaciones de clase | Owner + coordinator (institución) |
| `bug_reports` | Reportes de error enviados por usuarios | Owner insert/read, admin read-all |

### Funciones SQL (SECURITY DEFINER)
| Función | Propósito |
|---------|-----------|
| `handle_new_user()` | Trigger: crea `app_users` al registrarse, asigna institución por invite_code |
| `current_institution_id()` | Devuelve `institution_id` del usuario autenticado (usado en RLS) |
| `current_user_role()` | Devuelve `role` del usuario autenticado (usado en RLS) |

---

## Integración 2 — Google Gemini 2.0 Flash

| Parámetro | Valor |
|-----------|-------|
| Modelo | `gemini-2.0-flash` |
| SDK | `@google/genai` v1.x |
| Temperatura | 0.9 (creatividad alta para generar 3 ideas distintas) |
| Archivo | `app/src/services/aiService.ts` |
| Llamada | `generateContent({ contents: [...] })` |

### Prompts implementados

| Acción | Entrada | Salida esperada |
|--------|---------|----------------|
| Generar ideas de planeación | Tema, grado, asignatura, contexto | 3 objetos `PlanIdea` con título, objetivo, materiales, secuencia, evaluación |
| (Futuro) Comentarios cualitativos | Datos de asistencia y notas del estudiante | Borrador de comentario cualitativo en español |

---

## Integración 3 — Vercel (Despliegue)

| Parámetro | Valor |
|-----------|-------|
| Root directory | `app/` |
| Build command | `pnpm build` |
| Output directory | `dist/` |
| Node.js version | 20.x |
| Rewrite SPA | `vercel.json`: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }` |
| Branch de producción | `feat/claude-implementation` (actualmente) |

---

## Integración 4 — PWA / Service Worker

| Parámetro | Valor |
|-----------|-------|
| Plugin | `vite-plugin-pwa` v1.3 |
| Estrategia | `generateSW` (genera automáticamente) |
| registerType | `autoUpdate` |
| Precache | 7 entradas (app shell + assets) |
| Modo offline | IndexedDB (`offlineQueue.ts`) para escrituras pendientes |
| Iconos | `app/public/icon-192.png`, `app/public/icon-512.png` |

---

## Integración 5 — Exportación PDF

| Parámetro | Valor |
|-----------|-------|
| Librería | `html2pdf.js` + `html2canvas` (dependencia interna) |
| Uso | `MyPlans.tsx`, `Planning.tsx` |
| Estrategia | Renderiza el componente React como imagen + genera PDF |
| Formato | A4, márgenes 10mm, escala 2x para resolución |

---

## Estado de integraciones externas de pagos / SMS / email

| Integración | Estado | Observación |
|-------------|--------|-------------|
| Pagos (Stripe / Wompi) | 🔜 Pendiente | Previsto para cuando TIZA salga del piloto gratuito |
| Correo transaccional (SendGrid / Resend) | 🔜 Pendiente | Supabase maneja el reset de contraseña vía su propio SMTP |
| SMS / notificaciones push | 🔜 Pendiente | La PWA tiene soporte para push notifications (infraestructura lista) |
| Google Analytics / Posthog | 🔜 Pendiente | Actualmente se usa `bug_reports` como proxy de eventos importantes |

---

*TIZA · Endpoints e Integraciones · v1.0 · 2026*