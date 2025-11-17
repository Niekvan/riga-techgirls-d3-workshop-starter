# SVG notes

## Why SVG?

- SVG (Scalable Vector Graphics) describes shapes in XML, so they stay crisp at any zoom level.
- D3 loves SVG because every bar, axis tick, or label can be addressed with regular DOM operations.

## `viewBox` makes SVG responsive

```
<svg viewBox="0 0 560 360">
  <!-- ... -->
</svg>
```

- `viewBox="minX minY width height"` defines an internal coordinate system.
- Any explicit `width`/`height` on the SVG simply scales that coordinate system up or down.
- By omitting `width`/`height` (or setting them to `100%`), the browser can stretch the SVG to fill its container while keeping the original aspect ratio defined by the viewBox.
- In this project the chart uses `viewBox="0 0 560 360"`, so even if the actual `<svg>` is resized (e.g., `width: 100%` via CSS), the contents maintain a 560x360 proportion.

## Practical D3 tips

1. Define `svgWidth`, `svgHeight`, and `margin` in JavaScript to match the numbers used in the viewBox. This keeps scales and layout math consistent.
2. Use `preserveAspectRatio="xMidYMid meet"` when you want the chart centered and fully visible inside any container.
3. When mixing HTML and SVG (like this template), wrap each visualization in its own container so the responsive rules only apply where you need them.
