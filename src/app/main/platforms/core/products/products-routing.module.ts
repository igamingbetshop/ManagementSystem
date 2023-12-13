import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {FilterOptionsResolver } from 'src/app/core/services';

import { ProductsComponent } from './products.component';

const routes: Routes = [

  {
    path:'',
    component:ProductsComponent,
    children:[
      // {
      //   path: 'product',
      //   loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
      //   resolve:{filterData:FilterOptionsResolver},
      // },
      {
        path: 'view-product',
        loadChildren: () => import('./product/view-product/view-product.module').then(m => m.ViewProductModule)

      },
      {
        path: 'all-products',
        loadChildren: () => import('./all-products/all-products.module').then(m => m.AllProductsModule),
        resolve:{filterData:FilterOptionsResolver},
      },
      {
        path: '',
        redirectTo: 'all-products',
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule
{

}
