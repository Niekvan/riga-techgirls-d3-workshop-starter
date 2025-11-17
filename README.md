# D3 + Vite Workshop Starter

This template gives workshop participants a ready-to-run D3 playground with Vite and pnpm. It includes a simple bar chart, modern tooling, and a minimal amount of scaffolding so attendees can focus on learning core D3 concepts. The UI borrows Riga TechGirls’ vibrant pink/purple palette so the workshop instantly feels on-brand.

## Prerequisites

- **Node.js 24+** – install from [nodejs.org](https://nodejs.org/) or via a version manager such as `fnm`, `nvm`, or `asdf`.
- **pnpm 10+** – install globally (`corepack enable` works on Node 18.19+), or follow the [pnpm docs](https://pnpm.io/installation).
- **Post-install approvals** – pnpm may prompt to approve post-install scripts (e.g., when dependencies run build steps). Approve these during installation so packages like Vite can finish setting up.

## Getting Started

```bash
pnpm install        # approve any post-install scripts when prompted
pnpm dev
```

Vite prints a local URL (default `http://localhost:5173`). Open it to view the starter visualization.

### Troubleshooting

- **Missing dependencies** – rerun `pnpm install` to ensure the lockfile is respected.
- **Permission prompts** – if pnpm warns that scripts were skipped, re-run `pnpm install --ignore-scripts=false` and approve them.
- **Node version mismatch** – confirm `node -v` is >= 18 and restart your terminal after switching versions.

## Build & Preview

```bash
pnpm build
pnpm preview
```

`pnpm preview` serves the production bundle locally for a final check before sharing workshop materials.

## Included Examples

1. **Animated bar chart** – demonstrates the D3 update/join pattern, transitions, and scale updates. Use the **Randomize data** button to trigger new values and watch the bars animate into place.
2. **Data-bound participant cards** – shows how D3 can bind data to regular DOM nodes (no SVG required). Click **Shuffle participants** to reorder the cards; D3 handles the DOM diff and animates the movement.
3. **Remote Kaggle dataset loader** – fetches a slice of the [Goodbooks-10k dataset](https://www.kaggle.com/datasets/zygmuntz/goodbooks-10k) and binds the results to cards. Hit **Load Kaggle sample** to pull the latest data (requires network access).

## Project Structure

```
├── index.html        # Entry HTML document loaded by Vite
├── src
│   ├── main.js       # D3 bootstrap + starter visualization
│   └── style.css     # Minimal styles for the demo
├── package.json
└── vite.config.js
```

## Customizing for the Workshop

- Edit `src/main.js` to introduce new datasets, scales, or interaction techniques.
- Expand `src/style.css` to demonstrate responsive layouts or theming.
- Swap the accent variables in `src/style.css` if you need to adapt the Riga TechGirls palette to another event.
- Adjust `vite.config.js` if you need custom aliases, plugins, or a different dev server port.
- Update the README with workshop-specific steps (links to slides, exercises, or data sources).
- Review `docs/structure.md` for insight into the container layout + sizing approach, and `docs/animations.md` for the FLIP walkthrough used in the DOM example.
