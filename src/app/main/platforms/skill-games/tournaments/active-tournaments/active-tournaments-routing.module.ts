import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ActiveTournamentsComponent} from "./active-tournaments.component";
import {ActiveTournamentComponent} from "./active-tournament/active-tournament.component";


const routes: Routes = [
  {
    path: '',
    component: ActiveTournamentsComponent
  },
  {
    path: ':id',
    component: ActiveTournamentComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})


export class ActiveTournamentsRoutingModule {}
