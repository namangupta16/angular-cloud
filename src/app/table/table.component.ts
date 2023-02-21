import { Component, Input } from "@angular/core";
import * as moment from "moment";
@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"]
})
export class TableComponent {
  showChart = false;
  buttontext = this.showChart ? "Hide Chart" : "Show Chart";
  selected = {};
  @Input() data;
  toggleChart() {
    this.showChart = !this.showChart;
    this.buttontext = this.showChart ? "Hide Chart" : "Show Chart";
  }
  onCheckboxClick = (event: any, item) => {
    if (event.target.checked) {
      this.selected[item.id] = item;
    } else {
      delete this.selected[item.id];
    }
  };
  getSelectedItems() {
    return Object.values(this.selected);
  }
  isChecked(id) {
    return this.selected[id] ? true : false;
  }
  getFormatedDate(date) {
    var dd = moment(date, "DD-MM-YYYY").format("DD/MMM");
    return dd;
  }
}
