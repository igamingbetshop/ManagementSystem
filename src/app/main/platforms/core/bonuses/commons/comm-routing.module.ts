import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommComponent } from './comm.component';
import { FilterOptionsResolver } from '../../resolvers/filter-options.resolver';

const routes: Routes = [
  {
    path: '',
    component: CommComponent,
    children:
      [
        {
          path: 'details',
          loadChildren: () => import('./tabs/details/details.module').then(m => m.DetailsModule),
        },
        {
          path: 'trigger-group',
          loadChildren: () => import('./tabs/triggers-group/triggers-group.module').then(m => m.TriggersGroupModule)
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
          pathMatch: 'full'
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommRoutingModule {

}
