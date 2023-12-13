import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { MapTeamsComponent } from './teams.component';




const routes: Routes = [
  {
    path:'',
    component: MapTeamsComponent,
    children:
      [
        {
          path: 'map-teams',
          loadChildren:() => import('./tabs/map-teams/map-teams.module').then(m => m.MapTeamsTabModule),
        },
        {
          path: 'mapped-teams',
          loadChildren:() => import('./tabs/mapped-teams/mapped-teams.module').then(m => m.MappedTeamsTabModule),
        },
        {
          path: '',
          redirectTo: 'map-teams',
          pathMatch:'full'
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapTeamsRoutingModule
{

}
