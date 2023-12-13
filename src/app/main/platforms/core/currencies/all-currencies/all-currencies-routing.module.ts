import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { AllCurrenciesComponent } from './all-currencies.component';



const routes: Routes = [
  {
    path: '',
    component: AllCurrenciesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class AllCurrenciesRoutingModule
{

}
