# Uvesentlig

Leon's personal site — blogg, prosjekter, bibliotek, CV, og admin.

Built with **Next.js 16** (App Router) + **Prisma 7** (SQLite via LibSQL) + **NextAuth v4**.

## Setup

```bash
npm install
cp .env.example .env
# Generate an admin password hash and paste into .env:
node -e "console.log(require('bcryptjs').hashSync('your-password', 12))"
npx prisma migrate dev   # creates dev.db
npm run seed             # adds sample posts/projects/books
npm run dev              # http://localhost:3000
```

Admin lives at `/admin` (password-protected).

## Stack

- **Next.js 16** with App Router and async params
- **Prisma 7** with `@prisma/adapter-libsql` for SQLite
- **NextAuth v4** with credentials provider (single-user password)
- **marked** for Markdown rendering
- **Google Books API** for ISBN lookup (no key required)

## Design system

Editorial warm minimalism. Three font families:

- **Source Serif 4** — body text
- **Caveat** — handwritten headings & site name
- **JetBrains Mono** — metadata, dates, tags

Cream paper (`#f4ede0`), ink (`#1c1815`), rust accent (`#b9532e`), hairline SVG dividers.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage (stacked: intro → leser nå → holder på med → siste fra bloggen) |
| `/blogg` | Blog list with tag filters |
| `/blogg/[slug]` | Single post with related projects |
| `/prosjekter` | Projects grouped by status |
| `/prosjekter/[slug]` | Project detail with related posts |
| `/bibliotek` | Hybrid: covers for "leser nå", catalogue table for the rest |
| `/cv` | CV |
| `/admin` | Dashboard (auth required) |
| `/admin/blogg` | Blog CRUD with Markdown editor + live preview |
| `/admin/prosjekter` | Project CRUD |
| `/admin/boker` | Books + ISBN lookup |
