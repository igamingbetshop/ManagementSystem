import {RouterModule, Routes} from "@angular/router";
import {GamesComponent} from "./games.component";
import {NgModule} from "@angular/core";


const routes: Routes = [
  {
    path: '',
    component: GamesComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})


export class GamesRoutingModule {}
