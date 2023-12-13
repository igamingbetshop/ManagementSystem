import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { AllActiveComponent } from './all-active.component';
import { SportFilterOptionsResolver } from '../../../resolvers/sport-filter-options.resolver';



const routes: Routes = [
  {
    path: '',
    component:AllActiveComponent,
    children : [
      {
        path: 'active',
        loadChildren: () => import('../active/active.module').then(m => m.ActiveModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllActiveRoutingModule
{

}
