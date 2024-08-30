import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FilterOptionsResolver } from 'src/app/core/services';
import { JackpotComponent } from './jackpot.component';

const routes: Routes = [
  {
    path: '',
    component: JackpotComponent,
    children:
      [
        {
          path: 'details',
          loadChildren: () => import('./tabs/details/details.module').then(m => m.DetailsModule),
        },
        {
          path: 'products',
          loadChildren: () => import('./tabs/products/products.module').then(m => m.ProductsModule),
          resolve: {
            filterOptions: FilterOptionsResolver,
          }
        },
        {
          path: '',
          redirectTo: 'details',
          pathMatch:'full'
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JackpotRoutingModule {

}
