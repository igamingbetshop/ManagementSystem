import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AllTeamsComponent} from './all-teams.component';


const routes: Routes = [
  {
    path: '',
    component: AllTeamsComponent,
    children: [
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllTeamsRoutingModule {

}
