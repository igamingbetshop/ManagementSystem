import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { FinishedComponent } from './finished.component';
import { SportFilterOptionsResolver } from '../../resolvers/sport-filter-options.resolver';



const routes: Routes = [

  {
    path:'',
    component: FinishedComponent,
    children:[
      {
        path: 'all-finished',
        loadChildren: () => import('./all-finished/all-finished.module').then(m => m.AllFinishedModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: 'finish',
        loadChildren: () => import('./finish/finish.module').then(m => m.FinishModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinishedRoutingModule
{

}
