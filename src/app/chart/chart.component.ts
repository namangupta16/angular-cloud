import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Chart } from "chart.js";
@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.scss"]
})
export class ChartComponent implements OnInit {
  @Input() data = [];
  @ViewChild("chart") private chartRef;
  chart: any;
  defaultLegendClickHandler;
  showAvailableDays = false;
  findAvailabledays() {
    if (!this.showAvailableDays) {
      return [];
    }
    const allDays = {};
    for (let i = 1; i <= 30; i++) {
      allDays[i] = true;
    }
    for (let i = 0; i < this.data.length; i++) {
      const start = Number(this.data[i].start.split("/")[0]);
      const end = Number(this.data[i].end.split("/")[0]);
      for (let k = start; k <= end; k++) {
        if (allDays[k]) {
          delete allDays[k];
        }
      }
    }
    return Object.keys(allDays);
  }
  legentOnClick = (e, legendItem) => {
    var index = legendItem.datasetIndex;

    if (index !== 0) {
      this.defaultLegendClickHandler(e, legendItem);
    } else {
      let ci = this.chart;
      this.showAvailableDays = !this.showAvailableDays;
      ci.options.lineAtIndex = this.findAvailabledays();
      ci.update();
    }
  };
  ngOnInit() {
    //Create horizontalBar plug-in for ChartJS
    this.defaultLegendClickHandler = Chart.defaults.global.legend.onClick;
    var originalLineDraw = Chart.controllers.horizontalBar.prototype.draw;
    Chart.helpers.extend(Chart.controllers.horizontalBar.prototype, {
      draw: function() {
        originalLineDraw.apply(this, arguments);

        var chart = this.chart;
        var ctx = chart.chart.ctx;

        var index = chart.config.options.lineAtIndex;
        for (let i = 0; i < index.length; i++) {
          const value = index[i];
          if (value) {
            var xaxis = chart.scales["x-axis-0"];
            var yaxis = chart.scales["y-axis-0"];

            var x1 = xaxis.getPixelForValue(value - 0.7);
            var y1 = 0 + 60;

            var x2 = xaxis.getPixelForValue(value - 0.3);
            var y2 = yaxis.height;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.strokeStyle = "rgba(54, 162, 235, 0.8)";
            ctx.fillStyle = "rgba(54, 162, 235, 0.8)";
            ctx.fillRect(x1, y1, x2 - x1, y2);
            ctx.stroke();

            ctx.restore();
          }
        }
      }
    });

    const initialData: any[] = [];
    const data: any[] = this.data.map(item => {
      const enddate = Number(item.end.split("/")[0]);
      const startdate = Number(item.start.split("/")[0]);
      initialData.push(startdate);
      return enddate - startdate;
    });
    const label = this.data.map(item => item.name);

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: "horizontalBar",
      data: {
        labels: label,
        datasets: [
          {
            label: "Available Days",
            data: initialData,
            backgroundColor: "rgba(0, 0, 0, 0)",
            hideInLegendAndTooltip: true
          },
          {
            label: "Not Available",
            data: data,
            backgroundColor: "rgb(255, 99, 132)"
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: "Sept 2019"
        },
        lineAtIndex: this.findAvailabledays(),
        legend: {
          onClick: this.legentOnClick,
          labels: {
            filter: function(legendItem, chartData) {
              return chartData.datasets[legendItem.datasetIndex].label;
            }
          }
        },
        hover: {
          animationDuration: 0
        },
        animation: {
          duration: 1,
          onComplete: function() {
            var ctx = this.chart.ctx;
            ctx.font = Chart.helpers.fontString(
              Chart.defaults.global.defaultFontFamily,
              "normal",
              Chart.defaults.global.defaultFontFamily
            );
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";

            this.data.datasets.forEach(function(dataset) {
              for (var i = 0; i < dataset.data.length; i++) {
                if (dataset.hideInLegendAndTooltip) {
                  return;
                }
                for (var key in dataset._meta) {
                  var model = dataset._meta[key].data[i]._model;
                  ctx.fillText(model.label, model.x + 20, model.y);
                }
              }
            });
          }
        },
        tooltips: {
          enabled: false
        },
        scales: {
          yAxes: [
            {
              stacked: true,
              display: false
            }
          ],
          xAxes: [
            {
              position: "top",
              stacked: true,
              ticks: {
                callback: function(value, index, values) {
                  return value < 31 ? value : value - 30;
                },
                min: 1,
                max: 32,
                stepSize: 1
              }
            }
          ]
        }
      }
    });
  }
}
