import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  tests: any;

  MainTestArr: any;
  servQusArr: any;
  objectAnsData: any;

  apiURL = "http://interviewapi.stgbuild.com/getQuizData";

  constructor(private http: HttpClient) {
    this.tests = this.getLocalstoregData("AllData")
    this.objectAnsData = this.getDatabyName("data");

  }

  getLocalstoregData(type: string) {
    let strData: any = localStorage.getItem(type);
    let arrData = JSON.parse(strData) || [];
    return arrData || [];
  }

  getData() {
    return this.http.get(this.apiURL)
  }

  getDatabyName(testName: string) {
    this.tests.forEach((element: any) => {
      if (element.name == testName) {
        this.MainTestArr = element;
        this.servQusArr = this.MainTestArr.questions;
      }
    });
  }

}
