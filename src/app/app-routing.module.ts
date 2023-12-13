import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuard} from "./core/guards/auth-guard";

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./sign-in/sign-in.module').then(m => m.SignInModule)
  },
  {
    path: 'main',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule),
    canLoad: [AuthGuard]
  },
  {
    path: '**', redirectTo: 'main', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
