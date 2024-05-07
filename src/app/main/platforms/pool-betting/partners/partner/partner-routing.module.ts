import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { PartnerComponent } from './partner.component';




const routes: Routes = [
  {
    path:'',
    component:PartnerComponent,
    children:
      [
        {
          path: 'main',
          loadChildren:() => import('./tabs/main/main.module').then(m => m.MainModule),
        },
        {
          path: 'web-site-settings',
          loadChildren:() => import('./tabs/web-site-settings/web-site-settings.module').then(m => m.WebSiteSettingsModule),
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
export class PartnerRoutingModule
{

}
