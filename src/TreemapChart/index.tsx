import ChartComponent from 'react-chartjs-2';
import { ChartDataSets, ChartTooltipModel } from 'chart.js';
import render, { div } from '../domBuilder';
import { createElementFromHTML, updateDomStyle } from '../domBuilder/utils';
import './tooltip.css';
export type TreemapChartDataset = ChartDataSets & {
  percentLabels?: string[];
  treeLabels?: string[];
  tree?: number[];
  fontColor?: string;
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: string;
  treeLongLabels?: string[];
  backgroundColor?: (ctx: any) => string;
};

export type TreemapChartProps = {
  values: number[]; // use to calculate rectangle's size, and display on the tooltip
  valuesInPercents: string[]; // use to render chart's label, string has format "12.12%"
  colors: string[]; // use to render background color;
  treeLabels: string[]; // use to render label on rectangle, example : MBS, BID
  treeLongLabels: string[]; // full description of treeLabels, example: MBB - Ngân hàng Quân đội
};
/**
 *  NOTE: This chart only support 1 dimension (group)
 */

export default function TreemapChart({
  values,
  valuesInPercents,
  treeLabels,
  treeLongLabels,
  colors,
}: TreemapChartProps) {
  // Validation length
  const totalItems =
    values.length +
    valuesInPercents.length +
    treeLabels.length +
    treeLongLabels.length +
    colors.length;
  if (
    totalItems / 5 !== values.length ||
    totalItems / 5 !== valuesInPercents.length ||
    totalItems / 5 !== treeLabels.length ||
    totalItems / 5 !== treeLongLabels.length ||
    totalItems / 5 !== colors.length
  ) {
    throw new Error("all TreemapChart's data props must have same length");
  }

  const treemapDataset: TreemapChartDataset = {
    label: 'ChartData', // well, use for nothing, it's chartjs's label
    tree: values,
    percentLabels: valuesInPercents,
    treeLabels: treeLabels,
    treeLongLabels: treeLongLabels,
    fontColor: '#fff',
    fontFamily: 'Averta Std CY',
    fontSize: 10,
    fontStyle: 'normal',
    backgroundColor: function (ctx: any) {
      let colorValue = colors[ctx.dataIndex];
      return colorValue;
    },
  };
  const data = {
    datasets: [treemapDataset] as TreemapChartDataset[],
  };
  const option = {
    legend: {
      display: false,
    },
    layout: {
      padding: {
        bottom: 100,
      },
    },
    tooltips: {
      enabled: false,
      custom: function tooltip(tooltipModel: ChartTooltipModel): void {
        let tooltipEl = document.getElementById('chartjs-tooltip');

        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = createElementFromHTML(
            render(
              div({
                id: 'chartjs-tooltip',
                children: div({
                  style: {
                    color: '#ffffff',
                    'background-color': '#283648',
                    border: 'px solid black',
                    'min-width': '200px',
                    padding: '12px',
                    'margin-top': '20px',
                    'margin-left': '-20px',
                  },
                  children: '',
                }),
              })
            )
          ) as HTMLElement;
          document.body.appendChild(tooltipEl);
        }

        // Hide if no tooltip
        if (tooltipModel.opacity === 0) {
          updateDomStyle(tooltipEl, {
            opacity: '0',
          });
          return;
        }

        // Set caret Position
        tooltipEl.classList.remove('above', 'below', 'no-transform');
        if (tooltipModel.yAlign) {
          tooltipEl.classList.add(tooltipModel.yAlign);
        } else {
          tooltipEl.classList.add('no-transform');
        }

        // Set Text
        if (tooltipModel.body) {
          let dataPoint = tooltipModel.dataPoints[0];
          if (!dataPoint) return;
          let item = data.datasets![0] as TreemapChartDataset; //item could be null

          const headerElement = div({
            children:
              dataPoint.index != null
                ? item.treeLongLabels![dataPoint.index]!.toString()
                : '',
            style: {
              'font-family': 'Averta Std CY',
              'font-weight': '700',
              'font-size': '15px',
              'line-height': '20px',
            },
          });

          const valueElement = div({
            style: {
              'font-family': 'Averta Std CY',
              'font-weight': '400',
              'font-size': '12px',
              'line-height': '16px',
            },
            children:
              dataPoint.index != null
                ? data.datasets[0].tree![dataPoint.index]!.toString()
                : '',
          });

          const percentElement = div({
            style: {
              'font-family': 'Averta Std CY',
              'font-weight': '400',
              'font-size': '12px',
              'line-height': '16px',
            },
            children:
              dataPoint.index != null
                ? data.datasets[0].percentLabels![dataPoint.index]!.toString()
                : '',
          });

          const tooltipElement = div({
            style: {},
            children: [headerElement, valueElement, percentElement],
          });

          let root = tooltipEl.children[0];
          root.innerHTML = render(tooltipElement);
        }
        let position = (this as any)._chart.canvas.getBoundingClientRect();

        updateDomStyle(tooltipEl, {
          opacity: '1',
          position: 'absolute',
          'pointer-events': 'none',
          left: position.left + window.pageXOffset + tooltipModel.caretX + 'px',
          top: position.top + window.pageYOffset + tooltipModel.caretY + 'px',
          'font-family': tooltipModel._bodyFontFamily,
          'font-size': tooltipModel.bodyFontSize + 'px',
          'font-style': tooltipModel._bodyFontStyle,
          padding: tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px',
        });
      },
    },
    animation: {
      duration: 0, // general animation time
    },
    hover: {
      animationDuration: 0, // duration of animations when hovering an item
    },
    responsiveAnimationDuration: 0, // animation duration after a resize
  };

  return <ChartComponent type="treemap" data={data} options={option} />;
}
