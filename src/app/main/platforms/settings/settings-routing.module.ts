import {RouterModule, Routes} from "@angular/router";
import {SettingsComponent} from "./settings.component";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'translations',
        loadChildren: () => import('./translations/translations.module').then(m => m.TranslationsModule),
        data: { InterfaceType: 1 }
      },
      {
        path: 'agent-translations',
        loadChildren: () => import('./translations/translations.module').then(m => m.TranslationsModule),
        data: { InterfaceType: 2 }
      },
      {
        path: '',
        redirectTo: 'settings',
        pathMatch:'full'
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
