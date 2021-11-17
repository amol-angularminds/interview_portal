import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../service/data.service';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  testName: string = "";
  testDataArr: any;
  questionArr: any;
  static counter: number = 0;
  finishTest: boolean = false;
  totalQuestion: number = 0; public wrongAns = 0; testMarks: number = 0; //variables for Marks

  ansLSArr: any = [];
  public selectedAns: any;

  usersAns: [] = [];
  correctAns: [] = [];

  form: FormGroup;

  constructor(private route: Router, private activatRoute: ActivatedRoute,
    private formBuilder: FormBuilder, private dataservice: DataService) {

    this.testName = this.activatRoute.snapshot.params.testName;
    if (TestComponent.counter != null) {
      TestComponent.counter = 0;
    }

    this.form = this.formBuilder.group({
      checkboxAns: this.formBuilder.array([]),
      selectedRdo: new FormControl('')
    })

    setTimeout(() => {
      this.totalQuestion = this.questionArr.length;
    }, 1000);

  }

  checkCheckBoxvalue(event: any) {
    this.selectedAns = event.target.value;
  }

  onCheckboxChange(e: any) {
    const checkboxAns: FormArray = this.form.get('checkboxAns') as FormArray;
    if (e.target.checked) {
      checkboxAns.push(new FormControl(parseInt(e.target.value)));
    }
    else {
      const index = checkboxAns.controls.findIndex(x => x.value === e.target.value);
      checkboxAns.removeAt(index);
    }
    console.log(checkboxAns);
  }

  checkAnswer(UserInput: any) {
    if (this.questionArr[TestComponent.counter].type == 'Multiple-Response') {
      let arr1 = this.questionArr[TestComponent.counter].correctOptionIndex;
      let arr2 = UserInput;
      let hasAllElems = true;

      for (let i = 0; i < arr1.length; i++) {
        if (arr2.indexOf(arr1[i]) == -1) {
          hasAllElems = false;
          break;
        }
      }

      if (hasAllElems && arr1.length == arr2.length) {
        this.testMarks++;
      }
      else {
        this.wrongAns++;
      }
    }
    else {
      if (this.questionArr[TestComponent.counter].correctOptionIndex == UserInput) {
        this.testMarks++;
      }
      else {
        this.wrongAns++;
      }
    }
  }

  prevQues() {
    if (this.questionArr[TestComponent.counter].type == 'Multiple-Response') {
      console.log(this.form.value.checkboxAns)
      if (this.usersAns[TestComponent.counter] != null && this.form.value.checkboxAns == null) {
        this.form.value.checkboxAns = this.usersAns[TestComponent.counter];
      }

      this.ansLSArr.splice(TestComponent.counter, 1, this.form.value.checkboxAns);
      localStorage.setItem("userAns", JSON.stringify(this.ansLSArr));
      this.form.value.checkboxAns = null;
      // this.ansLSArr[TestComponent.counter] = this.form.value.checkboxAns;
    }
    else {
      if (this.usersAns[TestComponent.counter] != null && this.selectedAns == null) {
        this.selectedAns = this.usersAns[TestComponent.counter];
      }
      this.ansLSArr[TestComponent.counter] = parseInt(this.selectedAns);

      // this.ansLSArr.splice([TestComponent.counter], 1, parseInt(this.selectedAns));
      localStorage.setItem("userAns", JSON.stringify(this.ansLSArr));
      this.selectedAns = "";
    }
    TestComponent.counter--;
  }


  nextQues() {

    if (this.questionArr[TestComponent.counter].type == 'Multiple-Response') {
      console.log(this.form.value.checkboxAns)
      this.checkAnswer(this.form.value.checkboxAns);
      if (this.usersAns[TestComponent.counter] != null && this.form.value.checkboxAns == null) {
        this.form.value.checkboxAns = this.usersAns[TestComponent.counter];
      }
      this.ansLSArr[TestComponent.counter] = this.form.value.checkboxAns;
      localStorage.setItem("userAns", JSON.stringify(this.ansLSArr));
      this.form.value.checkboxAns = null;
    }
    else {
      if (this.usersAns[TestComponent.counter] != null && this.selectedAns == null) {
        this.selectedAns = this.usersAns[TestComponent.counter];
      }
      this.ansLSArr[TestComponent.counter] = parseInt(this.selectedAns);
      // this.ansLSArr.splice([TestComponent.counter], 1, parseInt(this.selectedAns));
      this.checkAnswer(this.selectedAns);
      localStorage.setItem("userAns", JSON.stringify(this.ansLSArr));
      this.selectedAns = "";
    }


    if (TestComponent.counter < this.questionArr.length - 1) {
      TestComponent.counter++;
    }
    else {
      this.finishTest = true;
      TestComponent.counter++;
      TestComponent.counter = 0;
    }
    this.form.value.checkboxAns = [];
    // this.selectedAns = null;
  }




  compCBAns(id: number) {
    return (id == this.usersAns[TestComponent.counter]) ? true : false;
  }

  getCounter() {
    return TestComponent.counter;
  }

  finishBtn() {
    TestComponent.counter = 0;
    this.finishTest = true;
  }

  onItemChange(val: any) {
    console.log(" Value is : ", val.target.value);
  }

  ngOnInit(): void {
    this.testName = this.activatRoute.snapshot.params.testName;
    this.dataservice.getDatabyName(this.testName);
    this.testDataArr = this.dataservice.MainTestArr;
    this.questionArr = this.dataservice.servQusArr;

    this.usersAns = this.dataservice.getLocalstoregData("userAns");
    this.correctAns = this.dataservice.getLocalstoregData("correctAns");
  }

}