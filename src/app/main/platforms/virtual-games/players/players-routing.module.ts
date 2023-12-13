import {RouterModule, Routes} from "@angular/router";
import {PlayersComponent} from "../../sportsbook/players/players.component";
import {NgModule} from "@angular/core";
import {VirtualGamesFilterOptionsResolver} from "../resolvers/virtual-games-filter-options.resolver";

const routes: Routes = [

  {
    path:'',
    component:PlayersComponent,
    children:[
      {
        path: 'all-players',
        loadChildren: () => import('./all-players/all-players.module').then(m => m.AllPlayersModule),
        resolve:{filterData:VirtualGamesFilterOptionsResolver},
      },
      {
        path: 'player',
        loadChildren: () => import('./player/player.module').then(m => m.PlayerModule),
        resolve:{filterData:VirtualGamesFilterOptionsResolver},
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
