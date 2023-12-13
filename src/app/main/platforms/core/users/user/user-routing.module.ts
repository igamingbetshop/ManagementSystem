import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children:
      [
        {
          path: 'main',
          loadChildren: () => import('./tabs/main/main.module').then(m => m.MainModule),
        },
        {
          path: 'corrections',
          loadChildren: () => import('./tabs/corrections/corrections.module').then(m => m.CorrectionsModule),
        },
        {
          path: 'accounts-history',
          loadChildren: () => import('./tabs/accounts-history/accounts-history.module').then(m => m.AccountsHistoryModule),
        },
        {
          path: 'commission-plan',
          loadChildren: () => import('./tabs/commission-plan/commission-plan.module').then(m => m.CommissionPlanModule),
        },
        {
          path: 'product-limits',
          loadChildren: () => import('./tabs/product-limits/product-limits.module').then(m => m.ProductLimitsModule),
        },
        {
          path: 'user-settings',
          loadChildren: () => import('./tabs/user-settings/user-settings.module').then(m => m.UserSettingsModule),
        },
        {
          path: 'user-logs',
          loadChildren: () => import('./tabs/user-logs/user-logs.module').then(m => m.UserLogsModule),
        },
        {
          path: 'session',
          loadChildren: () => import('./tabs/sessions/sessions.module').then(m => m.SessionsModule),
        },
        {
          path: '',
          redirectTo: 'main',
          pathMatch: 'full'
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {

}
