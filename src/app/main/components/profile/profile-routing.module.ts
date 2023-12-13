import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { ProfileComponent } from './profile.component';


const routes: Routes = [
  {
    path:'',
    component:ProfileComponent,
    children:
      [
        {
          path: 'main',
          loadChildren:() => import('./tabs/main/main.module').then(m => m.MainModule),
        },
        {
          path: 'accounts-history',
          loadChildren:() => import('./tabs/accounts/accounts.module').then(m => m.AccountsModule),
        },
        {
          path: 'two-factor-authenticator',
          loadComponent:() => import('./tabs/two-factor-auth/two-factor-auth.component').then(c => c.TwoFactorAuthComponent)
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
export class ProfileRoutingModule
{

}
