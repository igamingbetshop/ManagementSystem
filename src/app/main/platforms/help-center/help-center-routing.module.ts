import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { HelpCenterComponent } from './help-center.component';

const routes: Routes = [
  {
    path: '',
    component: HelpCenterComponent,
    children: [
      {
        path: 'add-page',
        loadComponent: () => import('./platforms/add-page/add-page.component').then(c => c.AddPageComponent)
      },
      {
        path: 'core-platform',
        loadComponent: () => import('./platforms/core-section/core-section.component').then(c => c.CoreSectionComponent),
      },
      // {
      //   path: 'virtual-games',
      //   loadChildren: () => import('./platforms/virtual-games/virtual-games.module').then(m => m.VirtualGamesModule)
      // },
      // {
      //   path: 'skill-games',
      //   loadChildren: () => import('./platforms/skill-games/skill-games.module').then(m => m.SkillGamesModule)
      // },
      // {
      //   path: 'sportsbook',
      //   loadChildren: () => import('./platforms/sportsbook/sportsbook.module').then(m => m.SportsbookModule)
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpCenterRoutingModule {
}
