# GitHub Pages workflow

The workflow defined in `.github/workflows/deploy.yml` deploys the Vite build to GitHub Pages every time the `main` branch is updated.

Key steps:

1. **Checkout & Node setup** – Uses `actions/checkout@v4` and `actions/setup-node@v4` (Node 24) with pnpm caching.
2. **Install & build** – Enables Corepack, installs dependencies via `pnpm install --frozen-lockfile`, and runs `pnpm build` to generate the `dist/` folder.
3. **Upload artifact** – `actions/upload-pages-artifact@v3` packages the `dist/` output for the deployment job.
4. **Deploy** – `actions/deploy-pages@v4` publishes the artifact to GitHub Pages. The workflow uses the standard `pages` permissions and concurrency options recommended by GitHub.

If you fork this repo, follow these steps to ensure GitHub Pages uses the workflow:

1. Go to **Settings → Pages** in your GitHub repository.
2. Under **Source**, choose **GitHub Actions**.
3. Save the settings. GitHub will now deploy the site whenever the `deploy.yml` workflow succeeds on `main`.
