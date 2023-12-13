import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ViewObjectHistoryComponent} from "./view-object-history.component";

const routes: Routes = [
  {
    path: '',
    component: ViewObjectHistoryComponent
  }
];
@NgModule({
  declarations: [ViewObjectHistoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
})
export class ViewObjectHistoryModule {

}
