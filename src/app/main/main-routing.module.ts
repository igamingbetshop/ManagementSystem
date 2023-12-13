import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MainComponent} from './components/main/main.component';
import {SettingsModule} from "./platforms/settings/settings.module";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./components/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'platform',
        loadChildren: () => import('./platforms/core/core.module').then(m => m.CoreModule)
      },
      {
        path: 'virtualGames',
        loadChildren: () => import('./platforms/virtual-games/virtual-games.module').then(m => m.VirtualGamesModule)
      },
      {
        path: 'skillGames',
        loadChildren: () => import('./platforms/skill-games/skill-games.module').then(m => m.SkillGamesModule)
      },
      {
        path: 'sportsbook',
        loadChildren: () => import('./platforms/sportsbook/sportsbook.module').then(m => m.SportsbookModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./platforms/settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'help',
        loadChildren: () => import('./platforms/help-center/help-center.module').then(m => m.HelpCenterModule)
      },
      {
        path:'',
        redirectTo:'home',
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {
}
