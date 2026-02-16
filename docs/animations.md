# Animation notes

## FLIP pattern for participant cards

1. **First** – grab the current `getBoundingClientRect()` for each card before mutating the DOM.
2. **Last** – run the D3 join (which may add, remove, or reorder nodes) and capture the new bounding boxes.
3. **Invert** – set `transform: translate(dx, dy)` so every card instantly appears where it used to be.
4. **Play** – kick off a CSS transition to animate the card back to `translate(0, 0)`. The JavaScript does this via `requestAnimationFrame` so the browser has time to apply the inverted transform first.

This approach keeps DOM updates declarative (thanks to `selection.join`) while still allowing smooth motion between states, even when cards are shuffled dramatically.

## D3 transitions elsewhere

- The bar chart uses D3 transitions to animate height and axis updates after the data array changes. Because the scales and axes are defined once, the animation logic only needs to update domain values and call `.transition()`.
- The donut chart uses `d3.interpolate` inside an `attrTween` so each arc smoothly morphs from its previous angles to the new angles. We store the previous arc state on the DOM node (`this._current`) and update it each time so the next transition has a reliable starting point.
- Remote Kaggle cards use simple fade/slide transitions defined in CSS. This keeps the visualization logic focused on data loading while still giving users visual feedback when new data arrives.

## Donut arc interpolation (angles)

Each slice is an arc defined by start/end angles. During updates we keep the last arc angles on the DOM node, then interpolate between “previous” and “next” angles with `attrTween`:

```ts
paths.transition()
  .attrTween('d', function(d) {
    const i = d3.interpolate(this._current, d)
    this._current = i(1)
    return t => arc(i(t))
  })
```

Why this works:
- `d` is the new arc (next angles).
- `this._current` is the old arc (previous angles).
- The interpolator returns an arc for every `t` between 0 and 1, so the slice morphs smoothly instead of jumping.

## Donut legend counter interpolation

The legend percentages animate with a custom tween, so the numbers “count” to the new value:

```ts
label.transition()
  .tween('text', function(d) {
    const target = Math.round((d.value / total) * 100)
    const i = d3.interpolateNumber(this.__current ?? 0, target)
    return t => { this.textContent = `${Math.round(i(t))}%` }
  })
```

Why this works:
- `d3.interpolateNumber` gives a smooth numeric step for each frame.
- We store the last value (`__current`) so the counter animates from the previous percentage rather than restarting at 0.
