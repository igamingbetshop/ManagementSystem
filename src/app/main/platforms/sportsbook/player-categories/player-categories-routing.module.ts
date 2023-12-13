import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PlayerCategoriesComponent} from './player-categories.component';

const routes: Routes = [
  {
    path: '',
    component: PlayerCategoriesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerCategoriesRoutingModule {

}
