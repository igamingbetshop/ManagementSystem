import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { ClientCategoriesComponent } from './client-categories.component';



const routes: Routes = [
  {
    path: '',
    component: ClientCategoriesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientCategoriesRoutingModule
{

}
