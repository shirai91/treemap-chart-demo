const DefaultConfig = {
  hover: {
    mode: 'point',
    intersect: true,
  },
  tooltips: {
    mode: 'point',
    position: 'treemap',
    intersect: true,
    callbacks: {
      title: function (item: any, data: any) {
        return data.datasets[item[0].datasetIndex].key;
      },
      label: function (item: any, data: any) {
        var dataset = data.datasets[item.datasetIndex];
        var dataItem = dataset.data[item.index];
        return dataset.label + ': ' + dataItem.v;
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: 'linear',
        display: false,
      },
    ],
    yAxes: [
      {
        type: 'linear',
        display: false,
      },
    ],
  },
  elements: {
    rectangle: {
      borderSkipped: false,
      borderWidth: 0,
      spacing: 0.5,
    },
  },
};

export default DefaultConfig;
