import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {HotBetsComponent} from "./hot-bets.component";

const routes: Routes = [
  {
    path: '',
    component: HotBetsComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class HotBetsRoutingModule {

}
