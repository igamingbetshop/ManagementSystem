import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {BetShopsComponent} from "./bet-shops.component";


const routes: Routes = [
  {
    path: '',
    component:BetShopsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BetShopsRoutingModule {}
