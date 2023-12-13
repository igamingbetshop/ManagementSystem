import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { AllPartnersComponent } from './all-partners.component';



const routes: Routes = [
  {
    path: '',
    component:AllPartnersComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllPartnersRoutingModule
{

}
