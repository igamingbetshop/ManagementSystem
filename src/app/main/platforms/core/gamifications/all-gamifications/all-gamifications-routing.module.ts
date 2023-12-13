import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { AllGamificationsComponent } from './all-gamifications.component';



const routes: Routes = [
  {
    path: '',
    component: AllGamificationsComponent,
    children: [
      {
        path: 'gamification',
        loadChildren: () => import('../gamification/gamification.module').then(m => m.GamificationModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class AllGamificationsRoutingModule
{

}
