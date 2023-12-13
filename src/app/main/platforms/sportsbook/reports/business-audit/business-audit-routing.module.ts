import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { SportFilterOptionsResolver } from '../../resolvers/sport-filter-options.resolver';
import { BusinessAuditComponent } from './business-audit.component';



const routes: Routes = [

  {
    path:'',
    component:BusinessAuditComponent,
    children:[
      {
        path: 'change-history',
        loadChildren: () => import('./by-change-history/by-change-history.module').then(m => m.ByChangeHistoryModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: 'by-sessions',
        loadChildren: () => import('./by-sessions/by-sessions.module').then(m => m.BySessionsModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },

      {
        path: '',
        redirectTo: 'change-history',
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessAuditRoutingModule
{

}
