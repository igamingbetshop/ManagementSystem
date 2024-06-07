import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { PopupComponent } from './popup.component';



const routes: Routes = [
  {
    path:'',
    component: PopupComponent,
    children:
      [
        {
          path: 'main',
          loadChildren:() => import('./tabs/popup-main-info/popup-main-info.module').then(m => m.PopupMainInfoModule),
        },
        {
          path: 'popup-statistics',
          loadChildren:() => import('./tabs/popup-statistics/popup-statistics.module').then(m => m.PopupStatisticsModule),
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
export class PopupRoutingModule
{

}
