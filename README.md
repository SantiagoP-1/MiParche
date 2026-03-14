# Mi Parche 🩹

Aplicación web para recordatorios de parche anticonceptivo semanal.

## Stack

- **Next.js 14** (App Router + TypeScript)
- **Auth0** — Autenticación
- **Supabase** — Base de datos PostgreSQL
- **Tailwind CSS** — Estilos
- **Vercel** — Deploy (recomendado)

---

## Setup

### 1. Clonar e instalar

```bash
npm install
```

### 2. Variables de entorno

Copiar `.env.local.example` a `.env.local` y completar:

```bash
cp .env.local.example .env.local
```

### 3. Auth0

1. Crear cuenta en [auth0.com](https://auth0.com)
2. Crear una nueva **Application** → Regular Web Application
3. En **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback`
4. En **Allowed Logout URLs**: `http://localhost:3000`
5. Copiar Client ID, Client Secret y Domain al `.env.local`
6. Para el `AUTH0_SECRET`, generar con: `openssl rand -hex 32`

### 4. Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a **SQL Editor** y ejecutar el archivo `supabase/migrations/001_initial_schema.sql`
3. Copiar la URL y las keys al `.env.local`

### 5. Correr en desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## Estructura del proyecto

```
miparche/
├── app/
│   ├── (auth)/               # Login y registro
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/          # Dashboard protegido
│   │   └── dashboard/
│   ├── api/
│   │   ├── auth/[auth0]/     # Auth0 handler
│   │   └── cycles/           # CRUD de ciclos
│   ├── layout.tsx
│   ├── page.tsx              # Landing page
│   └── globals.css
├── components/
│   └── dashboard/            # Componentes del dashboard
├── lib/
│   ├── cycle-utils.ts        # Lógica de ciclos
│   ├── utils.ts              # cn() helper
│   └── supabase/             # Clientes Supabase
├── types/                    # TypeScript types
└── supabase/
    └── migrations/           # SQL schemas
```

---

## Roadmap

- [ ] Historial de ciclos anteriores
- [ ] Notificaciones push (web push API / FCM)
- [ ] Configuración de hora de notificación
- [ ] Soporte para otros métodos anticonceptivos
- [ ] PWA (installable en iPhone/Android)
- [ ] Exportar historial en PDF
- [ ] Partner mode (compartir con pareja)

---

## Deploy en Vercel

```bash
vercel deploy
```

Agregar las mismas variables de entorno en el panel de Vercel.  
Actualizar `AUTH0_BASE_URL` a la URL de producción.
