import * as Chart from 'chart.js';
import controller from './controller';
import defaults from './defaults';
/**
 * This code in this folder originally belong to https://github.com/kurkle/chartjs-chart-treemap/tree/2.x
 * because he's no longer maintain for 2.x version, and the component lack of features to fit our requirement
 * I think the best solution is fork the code as a base, and develop our own treemap chart from this
 */

function registerTreemapChart() {
  Chart.controllers.treemap = controller;
  Chart.defaults.treemap = defaults;

  (Chart as any).Tooltip.positioners.treemap = function (elements: any) {
    if (!elements.length) {
      return false;
    }

    var vm = elements[elements.length - 1]._view;

    return {
      x: vm.x,
      y: vm.y - vm.height / 2,
    };
  };
}

export default registerTreemapChart;
