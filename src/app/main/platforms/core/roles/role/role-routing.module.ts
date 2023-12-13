import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { RoleComponent } from './role.component';




const routes: Routes = [
  {
    path:'',
    component:RoleComponent,
    children:
      [
        {
          path: 'main',
          loadChildren:() => import('./tabs/main/main.module').then(m => m.MainModule),

        },
        {
          path: 'users',
          loadChildren:() => import('./tabs/users/users.module').then(m => m.UsersModule),

        },


        {
          path: '',
          redirectTo: 'main',
          pathMatch:'full'
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleRoutingModule
{

}
