import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';
import { TeamsComponent } from './teams.component';


const routes: Routes = [

  {
    path:'',
    component:TeamsComponent,
    children:[
      {
        path: 'all-teams',
        loadChildren: () => import('./all-teams/all-teams.module').then(m => m.AllTeamsModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: 'team',
        loadChildren: () => import('./team/team.module').then(m => m.TeamModule)
      },
      {
        path: '',
        redirectTo: 'all-teams',
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamsRoutingModule
{

}
