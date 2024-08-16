"use strict";

sap.ui.define(["sap/m/MessageToast", "chart.js"], function (MessageToast, __chartjs) {
  "use strict";

  const Chart = __chartjs["Chart"];
  /**
   * Generated event handler.
   *
   * @param this reference to the 'this' that the event handler is bound to.
   * @param event the event object provided by the event provider
   */
  function onPress(event) {
    MessageToast.show("Custom handler invoked.");
    const canvas = document.getElementById("Canvasid");
    if (!canvas) {
      MessageToast.show("error.");
      return;
    }
    const ctx = canvas.getContext("2d");
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['A', 'B'],
          datasets: [{
            label: 'Dataset',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            data: [10, 20]
          }]
        },
        options: {
          responsive: false,
          scales: {
            x: {
              display: false
            },
            y: {
              display: false,
              min: 0,
              max: 25
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: false
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
