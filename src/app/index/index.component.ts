import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})


export class IndexComponent implements OnInit {
  data: any[] = [];
  tests: any;



  constructor(private dataService: DataService, private route: Router) { }

  seteData() {
    this.dataService.getData().subscribe((data: any) => {
      this.tests = data.tests;
      this.dataService.tests = this.tests;
      localStorage.setItem("AllData", JSON.stringify(this.tests))
    });
  }

  setAnsArr(testName: any) {
    this.dataService.getDatabyName(testName);
    localStorage.setItem("QuesNo", "0");
    
    var temp: any = []; let i = 0;
    this.dataService.servQusArr.forEach((data: any) => {
      temp.push({ "id": i, "answer": data.correctOptionIndex, "input": null });
      i++;
    });
    localStorage.setItem("data", JSON.stringify(temp));
  }

  ngOnInit(): void {
    localStorage.clear();
    this.seteData();
    console.clear();
  }
}
