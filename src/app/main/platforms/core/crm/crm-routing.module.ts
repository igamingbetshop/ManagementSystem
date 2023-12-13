import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {FilterOptionsResolver } from 'src/app/core/services';
import { CrmComponent } from './crm.component';


const routes: Routes = [

  {
    path:'',
    component:CrmComponent,
    children:[
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
        resolve:{filterData:FilterOptionsResolver},
      },
      {
        path: 'templates',
        loadChildren: () => import('./templates/templates.module').then(m => m.TemplatesModule)
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrmRoutingModule
{

}
