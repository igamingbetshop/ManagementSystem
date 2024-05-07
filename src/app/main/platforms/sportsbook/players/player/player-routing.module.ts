import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { PlayerComponent } from './player.component';




const routes: Routes = [
  {
    path:'',
    component:PlayerComponent,
    children:
      [
        {
          path: 'main',
          loadChildren:() => import('./tabs/main/main.module').then(m => m.MainModule),

        },
        {
          path: 'sport-settings',
          loadChildren:() => import('./tabs/sport-settings/sport-settings.module').then(m => m.SportSettingsModule),

        },
        {
          path: 'bets',
          loadChildren:() => import('./tabs/bets/bets.module').then(m => m.BetsModule),
        },
        {
          path: 'notes',
          loadChildren:() => import('./tabs/notes/notes.module').then(m => m.NotesModule),
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
export class PlayerRoutingModule
{

}
