import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../service/data.service';
import { UntypedFormBuilder, UntypedFormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-online-test',
  templateUrl: './online-test.component.html',
  styleUrls: ['./online-test.component.css']
})
export class OnlineTestComponent implements OnInit {
  testName: string = "";
  testDataArr: any;
  questionArr: any;
  static counter:any;
  finishTest: boolean = false;
  totalQuestion: number = 0; //variables for Marks

  ansLSArr: any = [];
  public selectedAns: any;


  form: UntypedFormGroup;
  objectAnsData: any;
  opArr: any = [];

  constructor(private route: Router, private activatRoute: ActivatedRoute,
    private formBuilder: UntypedFormBuilder, private dataservice: DataService) {

    this.testName = this.activatRoute.snapshot.params.testName;
    if (OnlineTestComponent.counter != null) {
      OnlineTestComponent.counter = 0;
    }

    this.form = this.formBuilder.group({
      checkboxAns: this.formBuilder.array([]),
    })

    setTimeout(() => {
      this.totalQuestion = this.questionArr.length;
    }, 2000);

  }

  checkRadioBoxvalue(event: any) {
    this.selectedAns = event.target.value;
  }

  opStoreArr(id: any) {
    if(this.objectAnsData[OnlineTestComponent.counter].input != null){
      this.opArr=this.objectAnsData[OnlineTestComponent.counter].input||[];
    }

    if (this.opArr.includes(id)) {
      let a = this.opArr.indexOf(id);
      this.opArr.splice(a, 1);
    }
    else {
      this.opArr.push(id)
    }
  }

  submit() {  
    if (this.questionArr[OnlineTestComponent.counter].type == 'Multiple-Response') {
      if (this.opArr.length == []) {
        this.opArr = this.objectAnsData[OnlineTestComponent.counter].input ||[];
        this.objectAnsData[OnlineTestComponent.counter]["input"] = this.opArr;
        localStorage.setItem("data", JSON.stringify(this.objectAnsData));
      }
      else {
        this.objectAnsData[OnlineTestComponent.counter]["input"] = this.opArr;
        localStorage.setItem("data", JSON.stringify(this.objectAnsData));
      }
    }
    else {
      if (typeof this.selectedAns == "undefined" || this.selectedAns == "") {
        if (this.objectAnsData[OnlineTestComponent.counter].input != null) {
          this.selectedAns = this.objectAnsData[OnlineTestComponent.counter].input;
          this.objectAnsData[OnlineTestComponent.counter]["input"] = parseInt(this.selectedAns);
          localStorage.setItem("data", JSON.stringify(this.objectAnsData));
        }
      }
      else {
        this.objectAnsData[OnlineTestComponent.counter]["input"] = parseInt(this.selectedAns);
        localStorage.setItem("data", JSON.stringify(this.objectAnsData));
      }
    }
  }

  prevQues() {
    this.submit();
    this.selectedAns = "";
    this.opArr=[];
    OnlineTestComponent.counter--;
      localStorage.setItem("QuesNo",JSON.stringify(OnlineTestComponent.counter));
  }


  nextQues() {
    this.submit();
    this.selectedAns = "";
    this.opArr=[];

    if (OnlineTestComponent.counter < this.questionArr.length - 1) {
      OnlineTestComponent.counter++;
    }
    else {
      this.finishTest = true;
      OnlineTestComponent.counter++;
    }
    localStorage.setItem("QuesNo",JSON.stringify(OnlineTestComponent.counter));
  }

  compCBAns(id: number) {
    let CBAns: boolean = false;
    if (this.objectAnsData[OnlineTestComponent.counter]["input"] != null) {
      CBAns = this.objectAnsData[OnlineTestComponent.counter]["input"].includes(id)
    }
    return CBAns;
  }

  compRBAns(id: number) {
    let temp = this.objectAnsData[OnlineTestComponent.counter]["input"];
    return (id == temp) ? true : false;
  }

  getCounter() {
    return OnlineTestComponent.counter;
  }

  finishBtn() {
    this.submit();
    this.clickMethod();
  }

  clickMethod() {
    if(confirm("Are you sure to Submit the test")) {
    this.finishTest = true;
    OnlineTestComponent.counter =this.questionArr.length+2;
    localStorage.setItem("QuesNo",JSON.stringify(OnlineTestComponent.counter));
    }
  }
  ngOnInit(): void {
    this.testName = this.activatRoute.snapshot.params.testName;
    this.dataservice.getDatabyName(this.testName);
    this.testDataArr = this.dataservice.MainTestArr;
    this.questionArr = this.dataservice.servQusArr;
    this.objectAnsData = this.dataservice.getLocalstoregData("data");
    OnlineTestComponent.counter =localStorage.getItem("QuesNo");

    if(OnlineTestComponent.counter>=this.questionArr.length){
      console.log("navigation is nessesury");
      this.route.navigate(['']);
    }
  }

}
