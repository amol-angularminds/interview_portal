import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../service/data.service';
@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.css']
})
export class FinishComponent implements OnInit {

  @Input() totalQuestion: any;
  testMarks: number=0;
  wrongAns: number=0;
  objectAnsData: any;
  constructor(private dataservice: DataService) {

  }

  arrayEquals(a:[], b:[]) {
    if(Array.isArray(b) && b!= null){
      b=b.sort();
    }
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }

  ngOnInit(): void {
    this.objectAnsData = this.dataservice.getLocalstoregData("data");
    this.objectAnsData.forEach((element: any) => {
      if(typeof element.answer == null){
        this.wrongAns++;
      }
      else if(typeof element.answer == "object"){
        this.arrayEquals(element.answer,element.input)? this.testMarks++ : this.wrongAns++;
      }
      else{
        element.answer == element.input ? this.testMarks++ : this.wrongAns++;
      }
    });

    // setTimeout(() => {
    //   localStorage.clear();
    // }, 10000);
  }

}
