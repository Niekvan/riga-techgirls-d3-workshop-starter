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
// Radial chart demo data (simple categories with values).
const radialTopics = [
  { label: 'Story', value: 28 },
  { label: 'Mapping', value: 22 },
  { label: 'Interaction', value: 18 },
  { label: 'Animation', value: 14 },
  { label: 'Accessibility', value: 10 }
];
// Scatterplot demo data.
const scatterData = [
  { name: 'Aija', x: 12, y: 28, group: 'Beginner' },
  { name: 'Laura', x: 32, y: 18, group: 'Intermediate' },
  { name: 'Marta', x: 48, y: 46, group: 'Advanced' },
  { name: 'Signe', x: 22, y: 38, group: 'Beginner' },
  { name: 'Ilze', x: 40, y: 26, group: 'Intermediate' },
  { name: 'Rita', x: 28, y: 52, group: 'Advanced' }
];
// Force-directed demo data.
const networkNodes = [
  { id: 'Story' },
  { id: 'Maps' },
  { id: 'Data' },
  { id: 'Design' },
  { id: 'Code' },
  { id: 'Motion' }
];
const networkLinks = [
  { source: 'Story', target: 'Data' },
  { source: 'Story', target: 'Design' },
  { source: 'Maps', target: 'Data' },
  { source: 'Maps', target: 'Code' },
  { source: 'Motion', target: 'Design' },
  { source: 'Code', target: 'Data' }
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

// Example 4: radial chart (pie/donut) using d3.arc + d3.pie.
const radialExample = root.append('section').attr('class', 'radial-example');
radialExample.append('h2').text('Radial chart (donut)');
radialExample
  .append('p')
  .attr('class', 'hint')
  .text('D3 can generate arcs too. Click to reshuffle values.');
radialExample.style('position', 'relative');

const radialControls = radialExample.append('div').attr('class', 'controls');
radialControls
  .append('button')
  .text('Randomize topics')
  .on('click', () => {
    radialTopics.forEach((d) => {
      d.value = Math.round(8 + Math.random() * 26);
    });
    radialChart.update(radialTopics);
  });

const radialSvgSize = 320;
const radialSvg = radialExample
  .append('svg')
  .attr('viewBox', `0 0 ${radialSvgSize} ${radialSvgSize}`)
  .attr('role', 'img')
  .attr('aria-label', 'Radial chart of workshop topics');
const radialGroup = radialSvg
  .append('g')
  .attr('transform', `translate(${radialSvgSize / 2}, ${radialSvgSize / 2})`);
const radialLegend = radialExample.append('div').attr('class', 'radial-legend');
const radialTooltip = radialExample.append('div').attr('class', 'donut-tooltip');

// Example 5: scatterplot with hover labels.
const scatterExample = root.append('section').attr('class', 'scatter-example');
scatterExample.append('h2').text('Interactive scatterplot');
scatterExample
  .append('p')
  .attr('class', 'hint')
  .text('Hover a point to see the label. Click to jitter the data.');
const scatterControls = scatterExample.append('div').attr('class', 'controls');
scatterControls
  .append('button')
  .text('Jitter points')
  .on('click', () => {
    scatterData.forEach((d) => {
      d.x = Math.max(5, Math.min(55, d.x + (Math.random() * 10 - 5)));
      d.y = Math.max(5, Math.min(55, d.y + (Math.random() * 10 - 5)));
    });
    scatterPlot.update(scatterData);
  });
const scatterSvgWidth = 520;
const scatterSvgHeight = 320;
const scatterSvg = scatterExample
  .append('svg')
  .attr('viewBox', `0 0 ${scatterSvgWidth} ${scatterSvgHeight}`)
  .attr('role', 'img')
  .attr('aria-label', 'Scatterplot of demo data');
const scatterGroup = scatterSvg.append('g').attr('transform', 'translate(50,30)');

// Example 6: force-directed network.
const networkExample = root.append('section').attr('class', 'network-example');
networkExample.append('h2').text('Force-directed network');
networkExample
  .append('p')
  .attr('class', 'hint')
  .text('Drag nodes to feel how forces reshape the network.');
const networkSvgWidth = 520;
const networkSvgHeight = 320;
const networkSvg = networkExample
  .append('svg')
  .attr('viewBox', `0 0 ${networkSvgWidth} ${networkSvgHeight}`)
  .attr('role', 'img')
  .attr('aria-label', 'Force-directed network of topics');
const networkGroup = networkSvg.append('g');

const barChart = createBarChart({ barsGroup, xAxis, yAxis, xScale: x, yScale: y });
barChart.update(dataset);

const participantsList = createParticipantList(cardsContainer);
participantsList.update(participants);

const radialChart = createRadialChart({
  group: radialGroup,
  legend: radialLegend,
  tooltip: radialTooltip
});
radialChart.update(radialTopics);

const scatterPlot = createScatterPlot({
  group: scatterGroup,
  width: scatterSvgWidth - 80,
  height: scatterSvgHeight - 60
});
scatterPlot.update(scatterData);

const network = createNetwork({ group: networkGroup, width: networkSvgWidth, height: networkSvgHeight });
network.render({ nodes: networkNodes, links: networkLinks });

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

/**
 * Factory for a simple donut chart.
 * @param {{group: d3.Selection, legend: d3.Selection, tooltip: d3.Selection}} params
 */
function createRadialChart({ group, legend, tooltip }) {
  const radius = 120;
  const color = d3.scaleOrdinal().range(['#ff2b70', '#ffd94a', '#6ae1ff', '#b388ff', '#9fffa8']);
  const arc = d3.arc().innerRadius(55).outerRadius(radius);
  const pie = d3
    .pie()
    .sort(null)
    .value((d) => d.value);

  return {
    update(data) {
      color.domain(data.map((d) => d.label));
      const arcs = pie(data);
      const transition = d3.transition().duration(700);

      group
        .selectAll('path')
        .data(arcs, (d) => d.data.label)
        .join(
          (enter) => {
            const path = enter
              .append('path')
              .attr('fill', (d) => color(d.data.label))
              .attr('d', arc)
              .each(function (d) {
                this._current = d;
              });
            path.append('title').text((d) => `${d.data.label}: ${d.data.value}`);
            return path;
          },
          (update) => update,
          (exit) => exit.remove()
        )
        .transition(transition)
        .attrTween('d', function (d) {
          const interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(1);
          return (t) => arc(interpolate(t));
        });

      group
        .selectAll('path')
        .select('title')
        .text((d) => `${d.data.label}: ${d.data.value}`);

      group
        .selectAll('path')
        .on('mouseenter', (event, d) => {
          const { left, top } = radialExample.node().getBoundingClientRect();
          const x = (event.clientX ?? event.pageX) - left;
          const y = (event.clientY ?? event.pageY) - top;
          tooltip
            .style('left', `${x + 12}px`)
            .style('top', `${y + 12}px`)
            .style('opacity', 1)
            .style('display', 'grid')
            .html(`<strong>${d.data.label}</strong><span>${d.data.value}</span>`);
        })
        .on('mousemove', (event) => {
          const { left, top } = radialExample.node().getBoundingClientRect();
          const x = (event.clientX ?? event.pageX) - left;
          const y = (event.clientY ?? event.pageY) - top;
          tooltip.style('left', `${x + 12}px`).style('top', `${y + 12}px`);
        })
        .on('mouseleave', () => {
          tooltip.style('opacity', 0).style('display', 'none');
        });

      const total = d3.sum(data, (d) => d.value);
      const keys = legend
        .selectAll('.radial-key')
        .data(data, (d) => d.label)
        .join(
          (enter) => {
            const row = enter.append('div').attr('class', 'radial-key');
            row.append('span').attr('class', 'swatch');
            row.append('span').attr('class', 'label');
            row.append('strong').text('0%');
            return row;
          },
          (update) => update,
          (exit) => exit.remove()
        );

      keys.select('.label').text((d) => d.label);
      keys.select('.swatch').style('background', (d) => color(d.label));

      keys.select('strong')
        .each(function (d) {
          const target = Math.round((d.value / total) * 100);
          const fallback = Number(this.textContent.replace('%', ''));
          const current = Number.isFinite(this.__current) ? this.__current : Number.isFinite(fallback) ? fallback : 0;
          this.__current = target;
          d3.select(this)
            .transition()
            .duration(600)
            .tween('text', () => {
              const interpolate = d3.interpolateNumber(current, target);
              return (t) => {
                this.textContent = `${Math.round(interpolate(t))}%`;
              };
            });
        });
    }
  };
}

/**
 * Factory for a scatterplot with hover labels.
 * @param {{group: d3.Selection, width: number, height: number}} params
 */
function createScatterPlot({ group, width, height }) {
  const xScale = d3.scaleLinear().domain([0, 60]).range([0, width]).nice();
  const yScale = d3.scaleLinear().domain([0, 60]).range([height, 0]).nice();
  const color = d3
    .scaleOrdinal()
    .domain(['Beginner', 'Intermediate', 'Advanced'])
    .range(['#ffd94a', '#6ae1ff', '#ff2b70']);

  const xAxis = group.append('g').attr('transform', `translate(0, ${height})`);
  const yAxis = group.append('g');
  xAxis.call(d3.axisBottom(xScale));
  yAxis.call(d3.axisLeft(yScale));

  const dots = group.append('g');
  const labels = group.append('g');

  return {
    update(data) {
      dots
        .selectAll('circle')
        .data(data, (d) => d.name)
        .join(
          (enter) =>
            enter
              .append('circle')
              .attr('cx', (d) => xScale(d.x))
              .attr('cy', (d) => yScale(d.y))
              .attr('r', 0)
              .attr('fill', (d) => color(d.group))
              .attr('opacity', 0.85)
              .call((enter) => enter.transition().duration(400).attr('r', 7)),
          (update) =>
            update
              .transition()
              .duration(400)
              .attr('cx', (d) => xScale(d.x))
              .attr('cy', (d) => yScale(d.y))
              .attr('fill', (d) => color(d.group)),
          (exit) => exit.transition().duration(200).attr('r', 0).remove()
        );

      labels
        .selectAll('text')
        .data(data, (d) => d.name)
        .join(
          (enter) =>
            enter
              .append('text')
              .attr('text-anchor', 'start')
              .attr('font-size', 12)
              .attr('fill', '#f7f7ff')
              .attr('opacity', 0),
          (update) => update,
          (exit) => exit.remove()
        )
        .attr('x', (d) => xScale(d.x) + 10)
        .attr('y', (d) => yScale(d.y) + 4)
        .text((d) => d.name);

      dots
        .selectAll('circle')
        .on('mouseenter', (_, d) => {
          labels.selectAll('text').attr('opacity', (label) => (label.name === d.name ? 1 : 0));
        })
        .on('mouseleave', () => {
          labels.selectAll('text').attr('opacity', 0);
        });
    }
  };
}

/**
 * Factory for a force-directed network.
 * @param {{group: d3.Selection, width: number, height: number}} params
 */
function createNetwork({ group, width, height }) {
  const linkGroup = group.append('g').attr('stroke', 'rgba(255,255,255,0.35)');
  const nodeGroup = group.append('g');

  return {
    render({ nodes, links }) {
      const simulation = d3
        .forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength(-180))
        .force('link', d3.forceLink(links).id((d) => d.id).distance(90))
        .force('center', d3.forceCenter(width / 2, height / 2));

      const link = linkGroup
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', 2);

      const node = nodeGroup
        .selectAll('g.node')
        .data(nodes, (d) => d.id)
        .join((enter) => {
          const g = enter.append('g').attr('class', 'node');
          g.append('circle')
            .attr('r', 18)
            .attr('fill', 'rgba(255,43,112,0.85)')
            .attr('stroke', 'rgba(255,255,255,0.6)')
            .attr('stroke-width', 1.5);
          g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', 11)
            .attr('fill', '#0b0a1d')
            .text((d) => d.id);
          return g;
        })
        .call(
          d3
            .drag()
            .on('start', (event, d) => {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            })
            .on('drag', (event, d) => {
              d.fx = event.x;
              d.fy = event.y;
            })
            .on('end', (event, d) => {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            })
        );

      simulation.on('tick', () => {
        link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y);

        node.attr('transform', (d) => `translate(${d.x}, ${d.y})`);
      });
    }
  };
}
