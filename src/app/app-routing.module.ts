import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinishComponent } from './finish/finish.component';
import { IndexComponent } from './index/index.component';
import { TestComponent } from './test/test.component';
import { OnlineTestComponent } from './online-test/online-test.component';
const routes: Routes = [
  {path:'',redirectTo:"/index.html", pathMatch:"full"},
  {path:'index.html',component:IndexComponent},
  {path:'test/:testName',component:TestComponent},
  {path:'onlinetest/:testName',component:OnlineTestComponent},
  {path:'finish.html',component:FinishComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
