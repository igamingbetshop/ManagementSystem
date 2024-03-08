import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {PartnerLevelsComponent} from "./partner-levels.component";

const routes: Routes = [
  {
      path: '',
      component: PartnerLevelsComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartnerLevelsRoutingModule {

}
