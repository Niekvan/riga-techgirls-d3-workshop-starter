import './style.css';
import * as d3 from 'd3';

/**
 * HOW TO READ THIS FILE
 *
 * 1) Setup constants and starter data.
 * 2) Bind plain DOM controls (button) using native browser APIs.
 * 3) Initialize SVG chart primitives (scales, axes, groups) with D3.
 * 4) Update the chart through one reusable update(data) function.
 *
 * The key boundary in this starter:
 * - HTML/UI shell is static in index.html (no D3 needed).
 * - D3 is used only for SVG/chart behavior.
 */

// -----------------------------
// 1) Setup constants and data
// -----------------------------

// Starter dataset. Keep this simple so learners can swap values easily.
const initialData = [18, 32, 24, 56, 41, 29, 48];
let dataset = [...initialData];

// Margin convention: the SVG has an outer size, then an inner drawing area.
// Axes and bars are drawn in the inner area to avoid clipping labels.
const svgWidth = 720;
const svgHeight = 400;
const margin = { top: 24, right: 24, bottom: 44, left: 52 };
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// -------------------------------------------------
// 2) Bind controls
// -------------------------------------------------

const updateButton = document.getElementById('update-data-button');
const svgElement = document.getElementById('bar-chart');

if (!updateButton) {
  throw new Error('Missing #update-data-button in index.html');
}

if (!svgElement) {
  throw new Error('Missing #bar-chart in index.html');
}

// --------------------------------------
// 3) Initialize SVG chart pieces with D3
// --------------------------------------

// D3 selects the existing SVG element from static HTML.
const svg = d3.select(svgElement);

// All chart elements go inside this translated <g> so we can use inner width/height.
const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

// Scales map data values -> pixel coordinates.
const xScale = d3.scaleBand().range([0, width]).padding(0.16);
const yScale = d3.scaleLinear().range([height, 0]);

// Axes are rendered into dedicated groups so they can be transitioned on updates.
const xAxis = chart.append('g').attr('transform', `translate(0, ${height})`);
const yAxis = chart.append('g');

// Bars get their own group for clean structure and easier future extension.
const barsGroup = chart.append('g');

// Factory pattern: create a chart object with an update(data) method.
const barChart = createBarChart({ barsGroup, xAxis, yAxis, xScale, yScale, height });

// First render on page load.
barChart.update(dataset);

// Button interaction: update data, then render.
updateButton.addEventListener('click', () => {
  dataset = randomizeData(dataset.length);
  barChart.update(dataset);
});

function randomizeData(length) {
  // d3.range creates [0..length-1], then we map each item to a random value.
  return d3.range(length).map(() => Math.round(10 + Math.random() * 90));
}

// ------------------------------------------------
// 4) Canonical chart updater: update(data) lifecycle
// ------------------------------------------------

/**
 * Creates a reusable bar chart controller that exposes an `update(data)` method.
 *
 * @param {object} params
 * @param {import('d3').Selection<SVGGElement, unknown, null, undefined>} params.barsGroup
 * @param {import('d3').Selection<SVGGElement, unknown, null, undefined>} params.xAxis
 * @param {import('d3').Selection<SVGGElement, unknown, null, undefined>} params.yAxis
 * @param {import('d3').ScaleBand<number>} params.xScale
 * @param {import('d3').ScaleLinear<number, number>} params.yScale
 * @param {number} params.height
 * @returns {{ update: (data: number[]) => void }}
 */
function createBarChart({ barsGroup, xAxis, yAxis, xScale, yScale, height }) {
  return {
    update(data) {
      // safeData prevents errors when data is empty.
      // With [] we still keep scale/axis math valid using a fallback [0].
      const safeData = data.length ? data : [0];

      // Update domains FIRST so axes and bars both read the latest mapping.
      xScale.domain(safeData.map((_, index) => index));
      yScale.domain([0, d3.max(safeData)]).nice();

      // One shared transition keeps axis and bar motion synchronized.
      const transition = d3.transition().duration(650);

      xAxis.transition(transition).call(d3.axisBottom(xScale).tickFormat((d) => `${d + 1}`));
      yAxis.transition(transition).call(d3.axisLeft(yScale));

      barsGroup
        .selectAll('rect')
        // Key by index so each bar keeps identity between updates.
        // This makes transitions stable instead of recreating all bars every time.
        .data(safeData, (_, index) => index)
        .join(
          (enter) =>
            enter
              .append('rect')
              .attr('x', (_, index) => xScale(index))
              .attr('width', xScale.bandwidth())
              // Start enter bars from the baseline for a "grow up" animation.
              .attr('y', height)
              .attr('height', 0),
          (update) => update,
          (exit) =>
            exit
              .transition(transition)
              .attr('y', height)
              .attr('height', 0)
              .remove()
        )
        .attr('fill', 'var(--bar-color)')
        .transition(transition)
        .attr('x', (_, index) => xScale(index))
        .attr('width', xScale.bandwidth())
        .attr('y', (value) => yScale(value))
        .attr('height', (value) => height - yScale(value));
    }
  };
}
