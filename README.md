# IYKOMO-TECH COMMUNICATION — Official Website & Portfolio Platform

The complete full-stack website for **Ikechukwu Egbo** and **IYKOMO-TECH COMMUNICATION** —
personal portfolio, software project showcase (**iykbook** & **iykschool**), IT
infrastructure services, technical knowledge hub, and a protected CMS Admin Console.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
PostgreSQL · Drizzle ORM · JWT Auth (jose) · bcryptjs

---

## ⚡ Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env
#    then edit .env and set DATABASE_URL

# 3. Create the database tables
npx drizzle-kit push

# 4. Run the dev server
npm run dev
#    open http://localhost:3000
```

The database seeds itself automatically on first request — projects, services,
skills, certificates, blog posts, site settings, and your admin accounts.

### Default Admin Login

| Field | Value |
|---|---|
| URL | `/admin/login` |
| Email | `admin@iykomotech.com` |
| Password | `IykomoAdmin2026!` |

> 🔐 **Change this password immediately** in *Admin → Users & Security* before going live.

---

## 📸 How to Add Your Own Pictures

There are **two ways**. Both are already built and working.

### Option 1 — Upload via Admin Console (easiest, no code)

1. Log in at **`/admin`**
2. On the **Overview** dashboard, the first card is **"Add Your Portrait Photo"**
3. **Drag & drop** your photo onto it, or click to browse your device
4. Done — it appears instantly on the Home hero and About page

Accepted: JPG, PNG, WEBP · Max 8MB · Recommended 4:5 portrait (e.g. 1080 × 1350)

The same page's **Site Settings & CMS** tab also has upload slots for:
- **Founder Portrait**
- **Company Logo (Full Lockup)** — horizontal logo with wordmark
- **Company Logo Mark** — square icon (navbar, footer, favicon)

Uploads are stored on disk in `public/uploads/` and recorded in PostgreSQL, so
they persist across restarts.

### Option 2 — Commit the file to your repository

Drop your photo into `public/images/` named exactly:

```
founder.jpg      <- recommended
founder.jpeg
founder.png
founder.webp
```

It is **auto-detected** and shown on the Home hero and About page with no
configuration. See `public/images/README.md`.

**Precedence:** Admin Console upload wins → then `founder.*` file → then branded placeholder.

> **Important for Vercel:** Vercel's filesystem is read-only at runtime, so
> Admin Console uploads won't persist there. On Vercel, use **Option 2** (commit
> the file). When self-hosting on your own VPS/hosting, both options work fully.

---

## 🚀 Deploy to Production

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "IYKOMO-TECH COMMUNICATION website"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

> `.gitignore` is already configured to exclude `node_modules/`, `.next/`,
> `.env` (your secrets), test artifacts, and uploaded media.

### Step 2 — Create a PostgreSQL database

Pick one (both have free tiers):

**Supabase** (recommended — you already know it)
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → Database → Connection string → URI**
3. Use the **Connection Pooling** (port `6543`) string for serverless hosting

**Neon**
1. Create a project at [neon.tech](https://neon.tech)
2. Copy the pooled connection string (includes `?sslmode=require`)

### Step 3 — Create the tables

Run this locally, pointed at your production database:

```bash
npx drizzle-kit push \
  --dialect postgresql \
  --schema ./src/db/schema.ts \
  --url "YOUR_PRODUCTION_DATABASE_URL"
```

> `drizzle.config.json` in this repo points at the local dev database.
> Always pass `--url` as shown above when targeting production.

### Step 4 — Deploy the app

**Vercel** (recommended for Next.js)
1. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repo
2. Add **Environment Variables**:
   | Key | Value |
   |---|---|
   | `DATABASE_URL` | your production Postgres connection string |
   | `JWT_SECRET` | a long random string (`openssl rand -base64 48`) |
3. Click **Deploy**

**Your own hosting / VPS**
```bash
npm ci --omit=dev=false
npm run build
npm run start        # serves on port 3000 — put Nginx/Apache in front for HTTPS
```

### Step 5 — Connect your domains

Point these at your deployment and add them in Vercel → *Settings → Domains*:

| Domain | Purpose |
|---|---|
| `iykomotech.com` | Main company site |
| `iykbook.iykomotech.com` | iykbook project |
| `iykschool.iykomotech.com` | iykschool project |

HTTPS is automatic on Vercel. On a VPS, use Certbot/Let's Encrypt.

---

## 🗂 Project Structure

```
src/
├── app/
│   ├── page.tsx                 Home (hero, projects, services, skills, blog)
│   ├── about/                   Biography & experience timeline
│   ├── portfolio/               IT support & infrastructure portfolio
│   ├── projects/                Project listing + [slug] case studies
│   ├── services/                IT & software service catalogue
│   ├── certificates/            Certifications & skills matrix
│   ├── blog/                    Knowledge hub + [slug] articles
│   ├── contact/                 Enquiry form
│   ├── not-found.tsx            404 page
│   ├── admin/
│   │   ├── login/               Admin sign-in
│   │   └── page.tsx             Protected CMS console (server-guarded)
│   └── api/
│       ├── auth/                login / logout / me
│       ├── projects/            CRUD + [id] patch/delete
│       ├── services/            CRUD + [id]
│       ├── posts/               Blog CRUD + [id]
│       ├── skills/              CRUD + [id]
│       ├── certifications/      CRUD + [id]
│       ├── contact/             Public enquiry submission
│       ├── messages/            Protected enquiry inbox + [id]
│       ├── upload/              Media library upload
│       ├── identity/            Founder photo & logo uploads
│       ├── uploads/[filename]   Serve uploaded files
│       ├── media/[id]           Delete media asset
│       ├── settings/            Site settings read/update
│       ├── admin/               overview / users / logs
│       └── health/              Healthcheck (/api/health)
├── components/                  Navbar, Footer, cards, forms, admin workspace
├── db/
│   ├── index.ts                 Drizzle client (reads DATABASE_URL)
│   └── schema.ts                All 12 tables
└── lib/
    ├── auth.ts                  JWT session helpers
    ├── audit.ts                 Activity logging
    ├── data.ts                  Queries + founder portrait resolution
    └── seed.ts                  Idempotent database seeding
```

## 🗄 Database Tables (12)

`profiles` · `categories` · `projects` · `project_images` · `skills` ·
`certifications` · `services` · `posts` · `contact_messages` · `media_assets` ·
`site_settings` · `activity_logs`

---

## 🔒 Security Notes

- All admin API routes verify a signed **HTTP-only JWT** session cookie server-side.
- Passwords hashed with **bcrypt** (10 rounds).
- Unauthenticated requests to protected APIs return **401**; `/admin` redirects to `/admin/login`.
- **Set `JWT_SECRET` in production** — the built-in fallback is for development only.
- Uploads are validated by MIME type and size (10MB media / 8MB identity).

## ✅ Verification

```bash
npx next typegen          # route types
npm exec tsc -- --noEmit  # type check
npm run build             # production build
npx playwright test       # end-to-end suite (needs `npx playwright install chromium`)
```

The E2E suite covers all public pages, image integrity, mobile/desktop overflow,
server-side auth guards, contact-form persistence, and admin CRUD reaching the
live public site.

---

© IYKOMO-TECH COMMUNICATION · Built by Ikechukwu Egbo
