import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import { UsersComponent } from './users.component';
import {FilterOptionsResolver } from 'src/app/core/services';

const routes: Routes = [

  {
    path:'',
    component:UsersComponent,
    children:[
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule)
      },
      {
        path: 'all-users',
        loadChildren: () => import('./all-users/all-users.module').then(m => m.AllUsersModule),
        resolve:{filterData:FilterOptionsResolver},
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
export class UsersRoutingModule
{

}
