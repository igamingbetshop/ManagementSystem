import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { ActiveMatchesComponent } from './active-matches.component';
import { SportFilterOptionsResolver } from '../../resolvers/sport-filter-options.resolver';



const routes: Routes = [

  {
    path:'',
    component: ActiveMatchesComponent,
    children:[
      {
        path: 'all-active',
        loadChildren: () => import('./all-active/all-active.module').then(m => m.AllActiveModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: '',
        redirectTo: 'all-active',
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActiveMatchesRoutingModule
{

}
