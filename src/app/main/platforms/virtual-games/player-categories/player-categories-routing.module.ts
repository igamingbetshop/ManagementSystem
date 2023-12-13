import {RouterModule, Routes} from "@angular/router";
import {PlayerCategoriesComponent} from "./player-categories.component";
import {NgModule} from "@angular/core";


const routes: Routes = [
  {
    path: '',
    component: PlayerCategoriesComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})


export class PlayerCategoriesRoutingModule {
}
