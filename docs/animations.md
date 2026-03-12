# Animation Notes

## Shared transition for chart updates

The starter uses one transition for axes and bars:

```js
const transition = d3.transition().duration(650);
xAxis.transition(transition).call(d3.axisBottom(xScale));
yAxis.transition(transition).call(d3.axisLeft(yScale));
```

Using a shared transition keeps visual timing consistent.

## Data join animation lifecycle

Bars use `join` so enter/update/exit are explicit:

```js
barsGroup
  .selectAll('rect')
  .data(data, (_, index) => index)
  .join(
    enter => enter.append('rect').attr('y', height).attr('height', 0),
    update => update,
    exit => exit.transition(transition).attr('y', height).attr('height', 0).remove()
  )
  .transition(transition)
  .attr('y', value => yScale(value))
  .attr('height', value => height - yScale(value));
```

This is the baseline pattern to reuse when adding more animated SVG marks.
