import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AllClientsComponent} from "./all-clients.component";

const routes: Routes = [
  {
    path: '',
    component:AllClientsComponent,
    children: [
      {
        path: 'client',
        loadChildren: () => import('../client/client.module').then(m => m.ClientModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllClientsRoutingModule
{

}
