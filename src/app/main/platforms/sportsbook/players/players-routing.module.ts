import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';
import { PlayersComponent } from './players.component';


const routes: Routes = [

  {
    path:'',
    component:PlayersComponent,
    children:[

      {
        path: 'all-players',
        loadChildren: () => import('./all-players/all-players.module').then(m => m.AllPlayersModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: 'player',
        loadChildren: () => import('./player/player.module').then(m => m.PlayerModule)
      },
      {
        path: '',
        redirectTo: 'all-players',
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayersRoutingModule
{

}
