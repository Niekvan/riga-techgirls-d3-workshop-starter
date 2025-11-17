# Project structure notes

## Container layout

- `#app` is the parent node for every D3 example. Keeping a single entrypoint makes it easier to reason about what D3 is mounting and ensures cleanup happens in one place.
- Each example (`.chart-example`, `.dom-example`, `.remote-example`) is appended as its own section. Working with separate containers prevents selections from accidentally targeting elements from other demos.
- The fixed SVG width/height plus a shared `margin` object allow the chart example to compute an inner drawing area once and reuse it across scales, axes, and transitions. This is a common D3 pattern that keeps math predictable.

## Styling and sizing

- Global sizing tokens (like `svgWidth`, `svgHeight`, and `margin`) live at the top of `src/main.js`. Because every chart element references the same values, changing dimensions for classroom demos only requires editing a single block.
- Styles in `src/style.css` avoid transitions on `.card` transforms so the JavaScript-driven FLIP animation can control movement precisely. Hover effects still use box-shadow transitions so the UI feels interactive without interfering with D3.

## Why structured containers help

1. **Scoped selections** – Each container only holds the markup for one visualization, so selectors such as `chartSection.append('svg')` or `domExample.append('div')` cannot leak into other examples.
2. **Reusability** – Workshops can duplicate an entire section to add another exercise without touching the rest of the DOM.
3. **Readability** – Attendees can scan the source and immediately see that each example follows a consistent `section → controls → visualization` pattern, mirroring how they should structure their own projects.
