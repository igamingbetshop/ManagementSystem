import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { AllCompetitionsCategoriesComponent } from './all-competitions-categories.component';




const routes: Routes = [
  {
    path: '',
    component:AllCompetitionsCategoriesComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllCompetitionsCategoriesRoutingModule
{

}
