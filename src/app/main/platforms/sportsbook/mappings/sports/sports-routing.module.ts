import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { SportsComponent } from './sports.component';

const routes: Routes = [
  {
    path:'',
    component:SportsComponent,
    children:
      [
        {
          path: 'map-sports',
          loadChildren:() => import('./tabs/map-sports/map-sports.module').then(m => m.MapSportsModule),
        },
        {
          path: 'mapped-sports',
          loadChildren:() => import('./tabs/mapped-sports/mapped-sports.module').then(m => m.MappedSportsModule),
        },
        {
          path: '',
          redirectTo: 'map-sports',
          pathMatch:'full'
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SportsRoutingModule
{

}
