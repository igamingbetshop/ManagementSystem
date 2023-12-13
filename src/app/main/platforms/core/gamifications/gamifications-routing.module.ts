import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FilterOptionsResolver } from 'src/app/core/services';
import { GamificationsComponent } from './gamifications.component';

const routes: Routes = [

  {
    path: '',
    component: GamificationsComponent,
    children: [
      // {
      //   path: 'gamification',
      //   loadChildren: () => import('./gamification/gamification.module').then(m => m.GamificationModule)
      // },
      {
        path: 'all-gamifications',
        loadChildren: () => import('./all-gamifications/all-gamifications.module').then(m => m.AllGamificationsModule),
        resolve: { filterData: FilterOptionsResolver },
      },
      {
        path: '',
        redirectTo: 'all-gamifications',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamificationsRoutingModule {

}
