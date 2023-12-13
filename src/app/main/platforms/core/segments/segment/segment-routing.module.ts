import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { SegmentComponent } from './segment.component';
import { ClientStatesResolver } from '../../resolvers/client-states.resolver';
import { FilterOptionsResolver } from '../../resolvers/filter-options.resolver';
import { ClientCategoryResolver } from '../../resolvers/client-category.resolver';

const routes: Routes = [
  {
    path:'',
    component:SegmentComponent,
    children:
      [
        {
          path: 'details',
          loadChildren:() => import('./tabs/details/details.module').then(m => m.DetailsModule),
          resolve:{clientStates:ClientStatesResolver,},

        },
        {
          path: 'clients',
          loadChildren:() => import('./tabs/clients/clients.module').then(m => m.ClientsModule),
          resolve:{filterData:FilterOptionsResolver,  clientStates:ClientStatesResolver,  clientCategories:ClientCategoryResolver},

        },
        {
          path: 'settings',
          loadChildren:() => import('./tabs/settings/settings.module').then(m => m.SettingsModule),

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
export class SegmentRoutingModule
{

}
