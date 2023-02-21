import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "chart-assignment";
  data = [];
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.http
      .get<any[]>("https://totalcloud-static.s3.amazonaws.com/intern.json")
      .subscribe(data => {
        this.data = data;
      });
  }
}
