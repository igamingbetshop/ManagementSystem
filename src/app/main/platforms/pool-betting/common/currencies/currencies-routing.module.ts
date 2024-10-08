import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PBCurrenciesComponent } from './currencies.component';

const routes: Routes = [
  {
    path: '',
    component: PBCurrenciesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurrenciesRoutingModule {

}
