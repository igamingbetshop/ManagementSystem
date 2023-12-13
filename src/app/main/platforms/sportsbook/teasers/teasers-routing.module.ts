import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {TeasersComponent} from "./teasers.component";

const routes: Routes = [
  {
    path: '',
    component: TeasersComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class TeasersRoutingModule {

}
