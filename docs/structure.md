# Starter Structure Notes

## Responsibility split

- `index.html` owns static page structure (headings, text, controls, SVG element).
- `src/main.js` wires plain DOM controls and owns chart behavior.
- D3 is used for SVG/chart logic only.

## Flow of the starter

1. Read static elements from the DOM (`getElementById`).
2. Initialize chart primitives (`scales`, `axes`, `groups`) inside the existing `<svg>`.
3. Call `update(data)` once for first render.
4. On button click, replace data and call `update(data)` again.

## Why this pattern is useful

- Keeps non-chart UI simple and framework-agnostic.
- Makes the D3 learning surface focused on chart concepts.
- Gives a clear extension path: add HTML in `index.html`, add chart logic in `main.js`.
