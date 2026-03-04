# CLAUDE.md

## Project Overview

Static marketing/landing page for **OndamZip**, a cross-platform compression utility. Hosted on GitHub Pages at **ondamsoft.com**.

## Repository Structure

```
.
├── index.html            # Main landing page (all HTML, CSS, JS in one file)
├── 404.html              # Custom 404 error page
├── privacy.html          # Privacy policy page
├── CNAME                 # GitHub Pages domain config (ondamsoft.com)
├── ads.txt               # Google AdSense verification
├── logo.png              # Main logo
├── logo-icon.png         # Icon logo
└── update/
    └── ondamzip.json     # Software update manifest (version, download URLs)
```

## Tech Stack

- **Pure HTML/CSS/JS** — no frameworks, no build step, no package manager
- Vanilla DOM manipulation (`querySelector`, `classList`)
- CSS media queries for responsive design (breakpoint: 768px)
- GitHub Pages for deployment (auto-deploys on push to `master`)

## Development Workflow

1. Edit files directly (no build process)
2. Commit to `master`
3. GitHub Pages auto-deploys — changes are live immediately

There is no CI/CD pipeline, no test suite, no linter configuration.

## Key Conventions

### Internationalization (i18n)

The site supports Korean (`ko`) and English (`en`). Translations work via:
- A `LANG` JavaScript object containing `ko` and `en` keys for every string
- HTML elements use `data-i18n` (text) and `data-i18n-html` (HTML content) attributes
- Language preference stored in `localStorage`
- **Always update both `ko` and `en` strings together** when changing content

### Version Updates

When a new OndamZip version is released, update **all three locations**:
1. `update/ondamzip.json` — version, notes, date, download URLs
2. `index.html` — hero section version display (search for `id="app-version"`)
3. `index.html` — download card URLs (search for `download_url` or `.exe`/`.dmg` links)

### CSS / Styling

- Mobile-first responsive design
- Primary color: `#3b82f6` (blue)
- BEM-like class naming: `.hero`, `.feature-card`, `.download-card`
- All styles are in a `<style>` block inside `index.html`

### JavaScript Patterns

- Inline `onclick` handlers for simple interactions
- `fetch()` for GitHub API calls (download counter)
- No external JS dependencies

### Commit Messages

- Written in **Korean**
- Format: version prefix or feature description, e.g. `v1.0.13 업데이트: 내용`
- Co-authored commits with AI assistants are acceptable

## Important Notes

- The `CNAME` file must not be modified — it controls the custom domain
- `ads.txt` contains AdSense verification — do not remove
- Download URLs point to GitHub Releases at `github.com/ondamsoft/OndamZip`
- The site uses Google AdSense (client ID in `index.html` head)
- KakaoPay integration for donations (Korean payment platform)
