import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { CoinsComponent } from './coins.component';

const routes: Routes = [
  {
    path: '',
    component:CoinsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoinsRoutingModule{}
