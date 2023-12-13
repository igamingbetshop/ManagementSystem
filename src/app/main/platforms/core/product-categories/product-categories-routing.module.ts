import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { ProductCategoriesComponent } from './product-categories.component';




const routes: Routes = [
  {
    path: '',
    component: ProductCategoriesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductCategoriesRoutingModule
{

}
