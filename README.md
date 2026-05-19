# TIZA

**Plataforma educativa con IA para docentes colombianos.**  
Planeación de clases asistida por IA · Registro de asistencia · Notas y boletines · Modo offline.

> *"TIZA no automatiza la enseñanza. Protege lo humano en el docente."*

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 · TypeScript · Tailwind CSS v4 |
| Build | Vite 6 · vite-plugin-pwa (PWA + offline) |
| Backend / DB | Supabase (PostgreSQL 15 + Auth + RLS) |
| IA | Google Gemini 2.0 Flash |
| Export | html2pdf.js |
| Deploy | Vercel (SPA) |
| CI/CD | GitHub Actions |

---

## Inicio rápido

**Requisitos:** Node.js 20+ · pnpm 10+

```bash
# 1. Clonar
git clone https://github.com/dany040518/TIZA.git
cd TIZA/app

# 2. Variables de entorno
cp ../.env.example .env.local
# Edita .env.local con tus claves (ver tabla abajo)

# 3. Instalar y correr
pnpm install
pnpm dev        # http://localhost:3000
```

### Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `VITE_SUPABASE_URL` | URL de tu proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave anon/pública de Supabase |
| `VITE_GEMINI_API_KEY` | API Key de Google AI Studio |

### Base de datos Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ejecuta las migraciones en el SQL Editor:
   - `supabase/migrations/20260507_init.sql` — schema inicial
   - `supabase/migrations/20260519_bug_reports.sql` — tabla de reportes
3. (Opcional) Activa Google OAuth en **Authentication → Providers → Google**

### Build de producción

```bash
pnpm build      # genera dist/
pnpm lint       # TypeScript type-check
pnpm test       # vitest
```

---

## Roles

| Rol | Acceso |
|-----|--------|
| `teacher` | Panel, planeación IA, asistencia, clases, estudiantes |
| `coordinator` | Revisión y aprobación de planeaciones de su institución |
| `admin` | Gestión de instituciones y códigos de invitación |

---

## Documentación del proyecto

### Estrategia

| Documento | Descripción |
|-----------|-------------|
| [Matriz Problema → Solución](docs/01_estrategia/problema-solucion.md) | 9 problemas reales del docente colombiano y cómo TIZA los resuelve |
| [Perfil de usuario](docs/01_estrategia/perfil-usuario.md) | Perfiles demográficos y técnicos de los 3 roles del sistema |
| [Diferencial competitivo](docs/01_estrategia/diferencial.md) | Tabla comparativa vs Google Classroom, Additio, Excel y otros |
| [Historias de Usuario · RF · RNF](docs/01_estrategia/HU_RF_RNF.md) | 30 HU + 30 RF + 10 RNF con criterios Gherkin y matriz de trazabilidad |

### Investigación y diseño

| Documento | Descripción |
|-----------|-------------|
| [Flujo de navegación](docs/02_investigacion/diagramas/flujo-navegacion.md) | Diagrama completo de rutas por rol, flujo offline y mapa de páginas |
| [Maquetas y sistema de diseño](docs/03_diseno/maquetas.md) | Paleta OKLCH, tipografía, componentes, resultados de pruebas con usuarios |
| [Dirección creativa](docs/03_diseno/TIZA_CREATIVE_DIRECTION.md) | Personalidad de marca, principios de diseño emocional, especificaciones visuales |
| [Figuras del documento académico](docs/Figures/README.md) | Directorio de imágenes referenciadas en el documento IEEE (wireframes, gráficas de investigación, user flow) |

### Arquitectura

| Documento | Descripción |
|-----------|-------------|
| [APIs e integraciones](docs/04_arquitectura/api-integraciones.md) | Stack completo, variables de entorno, Supabase schema, Gemini, Vercel, PWA, PDF |
| [Migraciones de BD](supabase/migrations/) | SQL con schema, RLS y triggers |

### Calidad y operaciones

| Documento | Descripción |
|-----------|-------------|
| [Pruebas de compatibilidad](docs/06_calidad/pruebas-compatibilidad.md) | Matriz de navegadores/dispositivos, pruebas offline, checklist responsive |
| [Pruebas de carga (k6)](load-tests/) | Scripts smoke y load para validación de rendimiento bajo tráfico |
| [CI/CD — Quality Gate](/.github/workflows/ci-standard-validation.yml) | pnpm install · type-check · vitest · vite build en cada push/PR |
| [Backup de BD](/.github/workflows/supabase-backup.yml) | pg_dump diario a las 3am UTC → GitHub Artifact (30 días) |

### Legal y privacidad

| Documento | Descripción |
|-----------|-------------|
| [Política de Privacidad](docs/05_legal/tiza-privacy-policy.md) | Tratamiento de datos personales |
| [Términos y Condiciones](docs/05_legal/tiza-terms-and-conditions.md) | Condiciones de uso de la plataforma |
| [Habeas Data](docs/05_legal/tiza-habeas-data.md) | Cumplimiento Ley 1581 de 2012 (Colombia) |

---

## Funcionalidades implementadas

| Módulo | Estado |
|--------|--------|
| Auth (email + Google OAuth) | ✅ |
| Multi-rol (teacher / coordinator / admin) | ✅ |
| Multi-institución con códigos de invitación | ✅ |
| Planeación de clases con IA (Gemini) | ✅ |
| Revisión de planeaciones (coordinador) | ✅ |
| Registro de asistencia | ✅ |
| Gestión de clases y estudiantes | ✅ |
| Importación CSV de estudiantes | ✅ |
| Exportación de planeaciones a PDF | ✅ |
| Modo offline con sincronización automática | ✅ |
| PWA instalable (Android / iOS) | ✅ |
| Canal de reporte de errores integrado | ✅ |
| Monitoreo global de errores (ErrorBoundary) | ✅ |

---

## Contribuir

1. Crea una rama desde `feat/claude-implementation`
2. El CI corre automáticamente en cada push (type-check + tests + build)
3. Los secretos necesarios para CI están en GitHub Settings → Secrets

---

*TIZA · Plataforma educativa · Colombia · 2026*