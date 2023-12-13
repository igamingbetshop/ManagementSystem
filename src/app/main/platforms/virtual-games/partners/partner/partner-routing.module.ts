import {RouterModule, Routes} from "@angular/router";
import {PartnerComponent} from "./partner.component";
import {NgModule} from "@angular/core";


const routes: Routes = [
  {
    path: '',
    component: PartnerComponent,
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      },
      {
        path: 'main',
        loadChildren: () => import('./tabs/main/main.module').then(m => m.MainModule),
      },
      {
        path: 'web-site-settings',
        loadChildren: () => import('./tabs/web-site-settings/web-site-settings.module').then(m => m.WebSiteSettingsModule),
      },
      {
        path: 'keys',
        loadChildren: () => import('./tabs/keys/keys.module').then(m => m.KeysModule),
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class PartnerRoutingModule {
}
