# Animation notes

## FLIP pattern for participant cards

1. **First** – grab the current `getBoundingClientRect()` for each card before mutating the DOM.
2. **Last** – run the D3 join (which may add, remove, or reorder nodes) and capture the new bounding boxes.
3. **Invert** – set `transform: translate(dx, dy)` so every card instantly appears where it used to be.
4. **Play** – kick off a CSS transition to animate the card back to `translate(0, 0)`. The JavaScript does this via `requestAnimationFrame` so the browser has time to apply the inverted transform first.

This approach keeps DOM updates declarative (thanks to `selection.join`) while still allowing smooth motion between states, even when cards are shuffled dramatically.

## D3 transitions elsewhere

- The bar chart uses D3 transitions to animate height and axis updates after the data array changes. Because the scales and axes are defined once, the animation logic only needs to update domain values and call `.transition()`.
- Remote Kaggle cards use simple fade/slide transitions defined in CSS. This keeps the visualization logic focused on data loading while still giving users visual feedback when new data arrives.
