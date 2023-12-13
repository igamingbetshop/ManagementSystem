import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {FilterOptionsResolver } from 'src/app/core/services';
import { RolesComponent } from './roles.component';

const routes: Routes = [

  {
    path:'',
    component:RolesComponent,
    children:[
      {
        path: 'role',
        loadChildren: () => import('./role/role.module').then(m => m.RoleModule)
      },
      {
        path: 'all-roles',
        loadChildren: () => import('./all-roles/all-roles.module').then(m => m.AllRolesModule),
        resolve:{filterData:FilterOptionsResolver},
      },
      {
        path: '',
        redirectTo: 'all-roles',
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule
{

}
