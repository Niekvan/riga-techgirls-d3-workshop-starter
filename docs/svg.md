# SVG Quick Reference

## Why this starter uses SVG

- SVG scales cleanly and stays sharp.
- D3 can bind data directly to SVG marks (`rect`, `path`, `circle`, `text`).

## Existing SVG element

This starter defines the SVG container in `index.html`:

```html
<svg id="bar-chart" viewBox="0 0 720 400"></svg>
```

D3 then selects and populates it:

```js
const svgElement = document.getElementById('bar-chart');
const svg = d3.select(svgElement);
```

## Margin convention

Chart content is drawn in an inner translated group:

```js
const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
```

This creates safe space for axes and keeps positioning math predictable.
