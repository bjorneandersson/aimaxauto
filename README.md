# Aimaxauto — Next.js 14 + Admin Panel

AI-Powered Car Ownership platform built with Next.js 14 (App Router), NextAuth.js, Prisma, and Vercel Postgres.

## Architecture

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Tailwind + global styles
│   ├── admin/
│   │   ├── layout.tsx              # Admin layout (auth-protected)
│   │   ├── login/page.tsx          # OAuth login (Google/GitHub)
│   │   ├── dashboard/page.tsx      # Stats overview
│   │   ├── vehicles/page.tsx       # Vehicle CRUD
│   │   ├── users/page.tsx          # User management + role editing
│   │   ├── parameters/page.tsx     # Valuation param editor
│   │   └── moderation/page.tsx     # Content moderation queue
│   └── api/
│       ├── auth/[...nextauth]/     # NextAuth handler
│       ├── vehicles/[id]/          # Vehicle API
│       ├── users/[id]/             # User API
│       ├── parameters/[id]/        # Param API
│       └── moderation/posts/[id]/  # Moderation API
├── components/
│   ├── Providers.tsx               # Session provider
│   └── admin/
│       ├── AdminSidebar.tsx        # Navigation sidebar
│       ├── VehicleTable.tsx        # Vehicle list + search
│       ├── UserTable.tsx           # User list + role management
│       ├── ParamEditor.tsx         # JSON parameter editor
│       └── ModerationQueue.tsx     # Flagged content review
├── engine/                         # Valuation engine (port from HTML)
├── lib/
│   ├── prisma.ts                   # Prisma client singleton
│   └── auth.ts                     # NextAuth configuration
├── middleware.ts                   # Admin route protection
└── types/
    └── next-auth.d.ts              # Type augmentation
```

## Setup — Step by Step

### 1. Create GitHub repo & clone

```bash
git clone <your-repo-url>
cd aimaxauto
npm install
```

### 2. Set up Vercel Postgres

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Create a new project (or import your GitHub repo)
3. Go to **Storage** → **Create Database** → **Postgres**
4. Copy the connection strings to `.env.local`

### 3. Set up OAuth providers

**Google:**
1. Go to [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID
3. Add `http://localhost:3000/api/auth/callback/google` as redirect URI
4. Add your production URL too: `https://your-domain.vercel.app/api/auth/callback/google`

**GitHub:**
1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Create new OAuth App
3. Homepage URL: `http://localhost:3000`
4. Callback URL: `http://localhost:3000/api/auth/callback/github`

### 4. Configure environment

```bash
cp .env.example .env.local
# Fill in all values
```

### 5. Initialize database

```bash
npx prisma db push      # Create tables
npm run db:seed          # Seed valuation parameters
```

### 6. Run locally

```bash
npm run dev
# Open http://localhost:3000/admin
```

### 7. Deploy to Vercel

```bash
git add .
git commit -m "Initial setup"
git push
```

Vercel will auto-deploy. Make sure to:
- Add all env variables in Vercel Dashboard → Settings → Environment Variables
- Update OAuth redirect URIs to your production URL

## Admin Access

Admin access is controlled by the `ADMIN_EMAILS` env variable. Any email listed there will automatically get the ADMIN role on first OAuth login. You can also promote users manually in the Users page.

## Key Decisions

| Choice | Rationale |
|--------|-----------|
| **Next.js 14 App Router** | Server components for admin pages = fast, secure |
| **NextAuth.js + OAuth** | No password management, secure by default |
| **Prisma + Vercel Postgres** | Type-safe ORM, serverless-ready, scales with Vercel |
| **Tailwind CSS** | Consistent with existing dark theme, rapid development |
| **Audit logging** | Every admin action is tracked for accountability |

## Next Steps

- [ ] Port the valuation engine from HTML to `src/engine/`
- [ ] Build the main app pages (garage, market, etc.) as Next.js routes
- [ ] Add AIRA chat integration with API routes
- [ ] Implement Stripe for subscription billing
- [ ] Add image upload for vehicle photos (Vercel Blob)
