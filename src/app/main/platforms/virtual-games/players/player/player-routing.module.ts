import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PlayerComponent} from "./player.component";


const routes: Routes = [
  {
    path: '',
    component: PlayerComponent,
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      },
      {
        path: 'main',
        loadChildren:() => import('./tabs/main/main.module').then(m => m.MainModule),
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class PlayerRoutingModule {
}
