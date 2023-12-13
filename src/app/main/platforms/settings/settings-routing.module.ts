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
