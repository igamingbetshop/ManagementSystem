import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AllPoolBettingComponent} from "./all-pool-betting.component";

const routes: Routes = [
  {
    path:'',
    component: AllPoolBettingComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllPoolBettingRouteModule {}
