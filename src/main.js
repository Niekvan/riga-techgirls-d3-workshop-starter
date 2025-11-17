import './style.css';
import * as d3 from 'd3';

/**
 * Static demo data that drives the chart example.
 * Keeping it in a single constant makes the domain math predictable.
 */
const initialData = [12, 36, 28, 52, 14, 48];
let dataset = [...initialData];

/**
 * Static workshop roster for the DOM-binding example.
 * Each entry is keyed by name so we can use it as a join key.
 */
const participants = [
  { name: 'Aija', focus: 'Storytelling with maps', level: 'Beginner' },
  { name: 'Laura', focus: 'Data cleaning', level: 'Intermediate' },
  { name: 'Marta', focus: 'Accessibility', level: 'Advanced' },
  { name: 'Signe', focus: 'Color theory', level: 'Beginner' }
];
// Kaggle dataset (Goodbooks-10k) mirrored on GitHub for easier workshop access.
const kaggleBooksUrl = 'https://raw.githubusercontent.com/zygmuntz/goodbooks-10k/master/books.csv';

// Chart layout settings used to compute the inner drawing area.
/**
 * Global sizing tokens so every chart component references the same values.
 */
const svgWidth = 560;
const svgHeight = 360;
const margin = { top: 20, right: 20, bottom: 40, left: 48 };
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// See docs/structure.md for more on how this container hierarchy is organized.
const root = d3.select('#app');
root.append('h1').text('D3 + Vite starter');
root
  .append('p')
  .attr('class', 'hint')
  .text('Edit src/main.js to start experimenting.');

// Example 1: animated bar chart (see docs/structure.md for section layout rationale).
// Mount the bar-chart container early so everything inside it is scoped.
const chartSection = root.append('section').attr('class', 'chart-example');
chartSection.append('h2').text('Animated bar chart');
chartSection
  .append('p')
  .attr('class', 'hint')
  .text('Click the button to randomize values and watch the transitions.');

const chartControls = chartSection.append('div').attr('class', 'controls');
chartControls
  .append('button')
  .text('Randomize data')
  .on('click', () => {
    dataset = dataset.map(() => Math.round(10 + Math.random() * 55));
    barChart.update(dataset);
  });

const svg = chartSection
  .append('svg')
  .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
  .attr('role', 'img')
  .attr('aria-label', 'Bar chart of demo data');

const chart = svg
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

const x = d3
  .scaleBand()
  .domain(dataset.map((_, index) => index))
  .range([0, width])
  .padding(0.15);

const y = d3.scaleLinear().domain([0, d3.max(dataset)]).range([height, 0]).nice();

const xAxis = chart
  .append('g')
  .attr('transform', `translate(0, ${height})`)
  .call(d3.axisBottom(x).tickFormat((d) => `#${d + 1}`));

const yAxis = chart.append('g').call(d3.axisLeft(y));

const barsGroup = chart.append('g'); // Stores bars so they can be re-used during updates.

// Example 2: data-bound DOM cards to show non-chart usage of D3.
const domExample = root.append('section').attr('class', 'dom-example');
domExample.append('h2').text('D3 DOM binding example');
domExample
  .append('p')
  .attr('class', 'hint')
  .text('This list is data-bound. Click shuffle to see D3 update the DOM.');

const domControls = domExample.append('div').attr('class', 'controls');
domControls
  .append('button')
  .text('Shuffle participants')
  .on('click', () => {
    participants.sort(() => Math.random() - 0.5);
    participantsList.update(participants);
  });

const cardsContainer = domExample.append('div').attr('class', 'card-grid');

// Example 3: remote dataset pulled from Kaggle (Goodbooks-10k).
const remoteExample = root.append('section').attr('class', 'remote-example');
remoteExample.append('h2').text('Remote Kaggle dataset');
const remoteHint = remoteExample
  .append('p')
  .attr('class', 'hint')
  .text('Load a small sample from the Goodbooks-10k Kaggle dataset (top-rated titles).');

const remoteControls = remoteExample.append('div').attr('class', 'controls');
remoteControls
  .append('button')
  .text('Load Kaggle sample')
  .on('click', () => {
    remoteBooks.load();
  });

const remoteList = remoteExample.append('div').attr('class', 'card-grid');

const barChart = createBarChart({ barsGroup, xAxis, yAxis, xScale: x, yScale: y });
barChart.update(dataset);

const participantsList = createParticipantList(cardsContainer);
participantsList.update(participants);

const remoteBooks = createRemoteBooksExample({
  hintSelection: remoteHint,
  listSelection: remoteList,
  datasetUrl: kaggleBooksUrl
});

/**
 * Factory for the bar chart updater so it can accept new datasets.
 * @param {{barsGroup: d3.Selection, xAxis: d3.Selection, yAxis: d3.Selection, xScale: d3.ScaleBand<number>, yScale: d3.ScaleLinear}} params
 */
function createBarChart({ barsGroup, xAxis, yAxis, xScale, yScale }) {
  return {
    update(data) {
      const safeData = data.length ? data : [0];
      xScale.domain(safeData.map((_, index) => index));
      yScale.domain([0, d3.max(safeData)]).nice();
      const transition = d3.transition().duration(800);

      xAxis.transition(transition).call(d3.axisBottom(xScale).tickFormat((d) => `#${d + 1}`));
      yAxis.transition(transition).call(d3.axisLeft(yScale));

      barsGroup
        .selectAll('rect')
        .data(safeData, (_, index) => index)
        .join(
          (enter) =>
            enter
              .append('rect')
              .attr('x', (_, index) => xScale(index))
              .attr('width', xScale.bandwidth())
              .attr('rx', 4)
              .attr('fill', 'var(--accent)')
              .attr('y', height)
              .attr('height', 0),
          (update) => update,
          (exit) =>
            exit
              .transition(transition)
              .attr('height', 0)
              .attr('y', height)
              .remove()
        )
        .transition(transition)
        .delay((_, index) => index * 60)
        .attr('x', (_, index) => xScale(index))
        .attr('width', xScale.bandwidth())
        .attr('y', (value) => yScale(value))
        .attr('height', (value) => height - yScale(value));
    }
  };
}

/**
 * Factory that returns a FLIP-based updater for the participant cards.
 * @param {d3.Selection} container
 */
function createParticipantList(container) {
  return {
    update(data) {
      const firstPositions = new Map();
      container.selectAll('.card').each(function (d) {
        if (!d) return;
        firstPositions.set(d.name, this.getBoundingClientRect());
      });

      const merged = container
        .selectAll('.card')
        .data(data, (d) => d.name)
        .join(
          (enter) =>
            enter
              .append('article')
              .attr('class', 'card')
              .style('opacity', 0)
              .html(
                (d) =>
                  `<h3>${d.name}</h3><p>${d.focus}</p><span class="badge">${d.level}</span>`
              ),
          (update) =>
            update.html(
              (d) => `<h3>${d.name}</h3><p>${d.focus}</p><span class="badge">${d.level}</span>`
            ),
          (exit) =>
            exit.each(function () {
              this.style.transition = 'opacity 200ms ease, transform 200ms ease';
              this.style.transform = 'translateY(-20px)';
              this.style.opacity = '0';
              setTimeout(() => this.remove(), 200);
            })
        )
        .order();

      void container.node().offsetHeight;
      const lastPositions = new Map();
      merged.each(function (d) {
        lastPositions.set(d.name, this.getBoundingClientRect());
      });

      merged.each(function (d) {
        const element = this;
        const first = firstPositions.get(d.name);
        const last = lastPositions.get(d.name);
        const invertX = first ? first.left - last.left : 0;
        const invertY = first ? first.top - last.top : 20;

        element.style.transition = 'none';
        element.style.transform = `translate(${invertX}px, ${invertY}px)`;
        element.style.opacity = first ? 1 : 0;

        void element.offsetWidth;

        requestAnimationFrame(() => {
          element.style.transition =
            'transform 450ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity 300ms ease';
          element.style.transform = 'translate(0, 0)';
          element.style.opacity = 1;
        });
      });
    }
  };
}

/**
 * Factory for the remote Kaggle loader so it can manage its own state.
 * @param {{hintSelection: d3.Selection, listSelection: d3.Selection, datasetUrl: string}} params
 */
function createRemoteBooksExample({ hintSelection, listSelection, datasetUrl }) {
  let cachedBooks = [];
  let isLoading = false;

  async function load() {
    if (isLoading) return;
    try {
      isLoading = true;
      hintSelection.text('Loading dataset from Kaggle...');
      const books = await d3.csv(datasetUrl, d3.autoType);
      cachedBooks = books
        .filter((book) => Number.isFinite(book.average_rating))
        .sort((a, b) => b.ratings_count - a.ratings_count)
        .slice(0, 6);
      hintSelection.text('Top-rated books from Goodbooks-10k (click to reload).');
      render(cachedBooks);
    } catch (error) {
      console.error('Failed to load Kaggle data', error);
      hintSelection.text('Failed to load Kaggle data. Please try again.');
    } finally {
      isLoading = false;
    }
  }

  function render(data) {
    const transition = d3.transition().duration(600);
    listSelection
      .selectAll('.card')
      .data(data, (d) => d.book_id)
      .join(
        (enter) =>
          enter
            .append('article')
            .attr('class', 'card')
            .style('opacity', 0)
            .style('transform', 'translateY(12px)'),
        (update) => update,
        (exit) =>
          exit
            .transition(transition)
            .style('opacity', 0)
            .style('transform', 'translateY(12px)')
            .remove()
      )
      .order()
      .html(
        (d) =>
          `<h3>${d.title}</h3><p>by ${d.authors?.split('/')[0] ?? 'Unknown'}</p><span class="badge">${Number(
            d.average_rating
          ).toFixed(1)} ★</span>`
      )
      .transition(transition)
      .style('opacity', 1)
      .style('transform', 'translateY(0)');
  }

  return { load };
}
