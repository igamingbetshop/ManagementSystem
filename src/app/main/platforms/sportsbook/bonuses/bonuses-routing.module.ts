import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { BonusesComponent } from './bonuses.component';
import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';



const routes: Routes = [

  {
    path:'',
    component:BonusesComponent,
    children:[
      {
        path: 'bonus-settings',
        loadChildren: () => import('./bonus-settings/bonus-settings.module').then(m => m.BonusSettingsModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: 'multiple-bonuses',
        loadChildren: () => import('./multiple-bonuses/multiple-bonuses.module').then(m => m.MultipleBonusesModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: 'multiple-cashback-bonuses',
        loadChildren: () => import('./multiple-cashback-bonuses/multiple-cashback-bonuses.module').then(m => m.MultipleCashbackBonusesModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },



    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BonusesRoutingModule
{

}
