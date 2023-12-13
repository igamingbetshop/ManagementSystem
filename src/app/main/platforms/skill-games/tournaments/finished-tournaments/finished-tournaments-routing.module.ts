import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {FinishedTournamentsComponent} from "./finished-tournaments.component";
import {FinishedTournamentComponent} from "./finished-tournament/finished-tournament.component";


const routes: Routes = [
  {
    path: '',
    component: FinishedTournamentsComponent
  },
  {
    path: ':id',
    component: FinishedTournamentComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})


export class FinishedTournamentsRoutingModule {}
