import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { AllFinishedComponent } from './all-finished.component';



const routes: Routes = [
  {
    path: '',
    component:AllFinishedComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllFinishedRoutingModule
{

}
