import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { PermissibleOddsComponent } from './permissible-odds.component';



const routes: Routes = [
  {
    path: '',
    component:PermissibleOddsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PermissibleOddsRoutingModule
{

}
