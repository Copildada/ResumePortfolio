# Akash Bhattacharya — Portfolio

A minimal, typography-forward one-page portfolio built with plain HTML/CSS/JS and a small Express server.

## Structure

| File | Purpose |
|------|---------|
| `index.html` | Page markup and content (resume-driven) |
| `assets/style.css` | All styling (light/dark theme, layout, animations) |
| `assets/app.js` | All interactivity (see Features below) |
| `server.js` | Express server — serves the static site + visit-counter API |
| `data/visits.json` | Persisted visit count (`{ "count": number, "updatedAt": ISOString }`) |
| `package.json` | Dependencies (Express only) |

## Features

**Content** — Sections for Home, About, Skills, Experience, Projects, Education, Certifications and Contact, populated from the résumé (PwC India experience, One Audit Platform / AI Agentic Marketplace / AI Document Validator projects, certifications, etc.).

**Extras added to boost engagement:**
- 🌗 Dark / light theme toggle (persisted, respects system preference)
- ⌨️ Command palette — press `Ctrl/⌘ + K` or `/` to jump to any section or run an action (copy email, open LinkedIn, download résumé)
- 🔤 Typed rotating hero role text + a small animated "whoami" terminal card
- 📊 Animated stat counters and a scroll progress bar
- 🕐 Live IST clock and an "open to opportunities" status pill in the sidebar
- 📋 One-click copy-to-clipboard for email/phone with toast confirmation
- 🖨️ "Download Résumé" opens a print-optimized résumé view (Save as PDF)
- 🎉 Konami code easter egg (`↑ ↑ ↓ ↓ ← → ← → B A`) triggers a confetti burst
- 🔍 SEO: Open Graph tags + JSON-LD `Person` structured data for better link previews/search
- 👁 **Live visit counter** in the footer, backed by a real API (see below)

## Visit Counter

Every page load calls `POST /api/visits`, which increments a persistent counter stored in `data/visits.json` and returns the updated total; the footer animates up to the new count. `GET /api/visits` returns the current count without incrementing it.

**Note on hosting:** this counter writes to the local filesystem. On platforms with persistent disks (Render standard instances, a VPS, etc.) the count survives restarts. On fully ephemeral/serverless hosts (Vercel serverless functions, some free tiers that wipe the filesystem on redeploy) the file resets whenever a fresh instance spins up. If you deploy somewhere ephemeral and want a count that truly never resets, swap `data/visits.json` for a tiny external store (e.g. a free Redis/Upstash instance or a Google Sheet) — the two functions to change are `readVisits()` / `writeVisits()` in `server.js`.

## Local Development

```bash
npm install
npm start
# Visit http://localhost:3000
```

## Updating Content

All résumé content lives directly in `index.html` — edit the relevant `<section>` and redeploy. Styling variables (colors, fonts, spacing) are centralized at the top of `assets/style.css` under `:root`.

## Deployment

Any Node host works (Render, Railway, a VPS, etc.) since this is a plain Express app:

1. Push to GitHub
2. Connect the repo to your platform
3. Build command: `npm install`
4. Start command: `npm start`

For platforms without a writable/persistent filesystem, see the note in **Visit Counter** above.
