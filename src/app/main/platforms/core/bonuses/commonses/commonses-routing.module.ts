import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { CommonsesComponent } from './commonses.component';



const routes: Routes = [
  {
    path: '',
    component:CommonsesComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommonsesRoutingModule
{

}
