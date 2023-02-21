import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";


import { AppComponent } from "./app.component";
import { TableComponent } from "./table/table.component";
import { ChartComponent } from "./chart/chart.component";

@NgModule({
  declarations: [AppComponent, TableComponent, ChartComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
