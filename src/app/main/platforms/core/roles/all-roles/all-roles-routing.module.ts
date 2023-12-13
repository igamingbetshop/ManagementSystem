import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { AllRolesComponent } from './all-roles.component';



const routes: Routes = [
  {
    path: '',
    component: AllRolesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class AllRolesRoutingModule
{

}
