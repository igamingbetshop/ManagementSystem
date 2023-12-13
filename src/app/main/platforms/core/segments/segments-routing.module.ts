import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonDataResolver, FilterOptionsResolver } from 'src/app/core/services';
import { SegmentsComponent } from './segments.component';
import { ClientStatesResolver } from '../resolvers/client-states.resolver';

const routes: Routes = [

  {
    path:'',
    component:SegmentsComponent,
    children:[

      {
        path: 'all-segments',
        loadChildren: () => import('./all-segments/all-segments.module').then(m => m.AllSegmentsModule),
        resolve:{filterData:FilterOptionsResolver, commonData:CommonDataResolver,  clientStates:ClientStatesResolver,},
      },
      {
        path: '',
        redirectTo: 'all-segments',
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SegmentsRoutingModule
{

}
