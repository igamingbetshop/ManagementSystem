import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { AllAffiliatesComponent } from './all-affiliates.component';

const routes: Routes = [
  {
    path: '',
    component: AllAffiliatesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllAffiliatesRoutingModule
{

}