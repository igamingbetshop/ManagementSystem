import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {UsersComponent} from "./users.component";

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,

    children:[
      {
        path: 'all-users',
        loadChildren: () => import('./all-users/all-users.module').then(m => m.AllUsersModule), //TODO will be added detail pages
      },
      {
        path: '',
        redirectTo: 'all-users',
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
