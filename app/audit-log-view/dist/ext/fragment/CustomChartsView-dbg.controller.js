"use strict";

sap.ui.define(["sap/m/MessageToast", "sap/ui/model/odata/v4/ODataModel"], function (MessageToast, ODataModel) {
  "use strict";

  //import { Chart } from '../libs/chart';
  //import { Chart } from 'chart.js';
  //import * as chartjs from '../libs/chart';
  //const Chart = chartjs;

  //console.log(`[STATIC IMPORT] Chart.js loaded: ${Chart.version}`);

  /**
   * Generated event handler.
   *
   * @param this reference to the 'this' that the event handler is bound to.
   * @param event the event object provided by the event provider
   */
  function onPress(event) {
    MessageToast.show("Custom handler invoked.");
    // @ts-ignore

    const oModel = this.getModel();
    if (!oModel || !(oModel instanceof ODataModel)) {
      MessageToast.show("Error: OData model is not available.");
      return;
    } else {
      MessageToast.show("Modeltype is ok");
    }

    //Charts maken met de data 
    var logData = null;
    const oBinding = oModel.bindContext("/Logs");
    oBinding.requestObject().then(oData => {
      const tabledata = countCategories(oData.value);
      const tabledata2 = countCategoriesOverTime(oData.value);
      drawAllCountChart(tabledata);
      drawOverTimeChart(tabledata2);
    }).catch(error => {
      MessageToast.show("Error fetching logs.");
    });
  }
  function countCategories(Data) {
    const categoryCounts = {};
    Data.forEach(log => {
      const category = log.category;
      if (category) {
        if (!categoryCounts[category]) {
          categoryCounts[category] = 0;
        }
        categoryCounts[category]++;
      }
    });
    return categoryCounts;
  }
  function countCategoriesOverTime(data) {
    const categoryCountsOverTime = {};
    data.forEach(log => {
      const category = log.category;
      const time = new Date(log.time);
      if (category && time) {
        let timeKey;
        timeKey = time.toISOString().slice(0, 13);
        if (!categoryCountsOverTime[timeKey]) {
          categoryCountsOverTime[timeKey] = {};
        }
        if (!categoryCountsOverTime[timeKey][category]) {
          categoryCountsOverTime[timeKey][category] = 0;
        }
        categoryCountsOverTime[timeKey][category]++;
      }
    });
    return categoryCountsOverTime;
  }
  function drawAllCountChart(categoryCounts) {
    const canvas = document.getElementById("Canvasid");
    if (!canvas) {
      MessageToast.show("Error: Canvas element not found.");
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      MessageToast.show("Error: Unable to get canvas context.");
      return;
    }
    const labels = Object.keys(categoryCounts);
    const data = Object.values(categoryCounts);
    // @ts-ignore
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Log Categories',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          data: data
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Categories'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Count'
            },
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: true
          },
          title: {
            display: true,
            text: 'Category Counts'
          }
        }
      }
    });
  }
  function drawOverTimeChart(categoryCounts) {
    const canvas = document.getElementById("Canvasid2");
    if (!canvas) {
      MessageToast.show("Error: Canvas element not found.");
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      MessageToast.show("Error: Unable to get canvas context.");
      return;
    }
    const labels = Object.keys(categoryCounts).sort();
    const categories = Array.from(new Set(labels.flatMap(label => Object.keys(categoryCounts[label]))));
    const colors = ['#FF6384',
    // Red
    '#36A2EB',
    // Blue
    '#FFCE56',
    // Yellow
    '#4BC0C0',
    // Green
    '#9966FF',
    // Purple
    '#FF9F40' // Orange
    ];
    const datasets = categories.map((category, index) => ({
      label: category,
      data: labels.map(label => categoryCounts[label][category] || 0),
      // Use 0 if category is missing in a particular time label
      fill: false,
      borderColor: colors[index % colors.length],
      // Cycle through predefined colors
      tension: 0.1
    }));
    if (ctx) {
      // @ts-ignore
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          responsive: true,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Time'
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Log Count'
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            title: {
              display: true,
              text: 'Category Counts Over Time'
            }
          }
        }
      });
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.onPress = onPress;
  return __exports;
});
//# sourceMappingURL=CustomChartsView-dbg.controller.js.map
