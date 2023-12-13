import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {AllPlayersComponent} from "./all-players.component";


const routes: Routes = [
  {
    path: '',
    component:AllPlayersComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})


export class AllPlayersRoutingModule {}
