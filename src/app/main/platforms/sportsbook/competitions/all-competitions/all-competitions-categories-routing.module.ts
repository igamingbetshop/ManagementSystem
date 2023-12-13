import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { AllCompetitionsComponent } from './all-competitions.component';




const routes: Routes = [
  {
    path: '',
    component:AllCompetitionsComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllCompetitionsRoutingModule
{

}
