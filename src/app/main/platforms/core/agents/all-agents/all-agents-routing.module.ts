import {RouterModule, Routes} from "@angular/router";
import {AllAgentsComponent} from "./all-agents.component";
import {NgModule} from "@angular/core";


const routes: Routes = [
  {
    path: '',
    component: AllAgentsComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AllAgentsRoutingModule {

}
