# D3 + Vite Starter Template

A neutral starter for building D3 visualizations with modern tooling.  
The default app includes one animated bar chart and one update button so you can quickly adapt it to your own data and chart type.

## Prerequisites

- Node.js `24+`
- pnpm `10+`

## Getting Started

```bash
pnpm install
pnpm dev
```

Vite prints a local URL (usually `http://localhost:5173`).

## Use This Starter In Your Own Repo

You can use this starter in two common ways.

### Option 1: Use as a GitHub template

1. Click **Use this template** on GitHub.
2. Create a new repository from this starter.
3. Clone your new repository locally:

```bash
git clone <your-new-repo-url>
cd <your-new-repo-name>
pnpm install
pnpm dev
```

### Option 2: Clone and re-publish manually

```bash
git clone <this-repo-url> my-d3-project
cd my-d3-project
rm -rf .git
git init
git add .
git commit -m "Initialize from D3 starter template"
git branch -M main
git remote add origin <your-new-repo-url>
git push -u origin main
```

## Build and Preview

```bash
pnpm build
pnpm preview
```

`pnpm preview` serves the production build from `dist/`.

## Architecture

- Static page structure is defined in [index.html](/Users/niekvansleeuwen/Documents/personal/riga-techgirls/d3-template/index.html).
- Plain DOM APIs handle non-SVG interactions (for example, button event binding).
- D3 handles SVG chart behavior only (scales, axes, joins, transitions).

## What Is Included

- A single D3 bar chart example in [`src/main.js`](/Users/niekvansleeuwen/Documents/personal/riga-techgirls/d3-template/src/main.js)
- Clean baseline styling in [`src/style.css`](/Users/niekvansleeuwen/Documents/personal/riga-techgirls/d3-template/src/style.css)
- Vite setup for fast local development and production builds
- GitHub Pages workflow in [`.github/workflows/deploy.yml`](/Users/niekvansleeuwen/Documents/personal/riga-techgirls/d3-template/.github/workflows/deploy.yml)

## Project Structure

```txt
.
├─ index.html
├─ src/
│  ├─ main.js
│  └─ style.css
├─ docs/
│  ├─ structure.md
│  ├─ svg.md
│  ├─ animations.md
│  └─ deployment.md
├─ package.json
└─ vite.config.js
```

## How to Extend This Starter

1. Replace `initialData` with your own dataset in `src/main.js`.
2. Add HTML controls/sections in `index.html`.
3. Bind new controls with plain DOM APIs in `src/main.js`.
4. Reuse the `createBarChart` updater pattern for new SVG visualizations.
5. Split chart logic into modules under `src/` as complexity grows.
6. Update scales and shape generators (`line`, `arc`, `area`, etc.) for new chart types.

## Deployment

Push to `main` to trigger the Pages workflow.  
See [`docs/deployment.md`](/Users/niekvansleeuwen/Documents/personal/riga-techgirls/d3-template/docs/deployment.md) for details.

### Enable GitHub Pages In Your Repo

To make Pages deployment work in your own project:

1. Keep [`.github/workflows/deploy.yml`](/Users/niekvansleeuwen/Documents/personal/riga-techgirls/d3-template/.github/workflows/deploy.yml) in your repository.
2. Go to **Settings -> Pages**.
3. Under **Source**, choose **GitHub Actions**.
4. Push to `main` (or run the workflow manually from the Actions tab).

If your default branch is not `main`, update the trigger branch in `deploy.yml`.
