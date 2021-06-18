import TreemapChart from './TreemapChart';
import './App.css';

function random(min: number, max: number) {
  return (
    Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) +
    Math.ceil(min)
  );
}

function getColor(colorCode: number) {
  if (colorCode === 0) return '#DD3640';
  if (colorCode === 1) return '#E7BC26';
  return '#00B98D';
}

function generateMockData(length: number) {
  let chartData = [];
  let chartColors = [];
  let chartLabels = [];
  let chartPercentLabels = [];
  let chartLongLabels = [];
  for (let index = 0; index < length; index++) {
    chartData.push(random(0, 200));
    const color = getColor(random(0, 2));
    chartColors.push(color);
    const label = `Ticker ${index + 1}`;
    chartLabels.push(label);
    chartLongLabels.push(`${label} - Long long desc`);
    chartPercentLabels.push(`${random(0, 100) / 100}%`);
  }
  return {
    chartData,
    chartColors,
    chartLabels,
    chartPercentLabels,
    chartLongLabels,
  };
}

const {
  chartData,
  chartColors,
  chartLabels,
  chartPercentLabels,
  chartLongLabels,
} = generateMockData(40);

function App() {
  return (
    <div className="App">
      <TreemapChart
        values={chartData}
        colors={chartColors}
        treeLabels={chartLabels}
        treeLongLabels={chartLongLabels}
        valuesInPercents={chartPercentLabels}
      />
    </div>
  );
}

export default App;
