import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BonusesComponent } from './bonuses.component';
import { CommonDataResolver, FilterOptionsResolver } from 'src/app/core/services';


const routes: Routes = [

  {
    path: '',
    component: BonusesComponent,
    children: [
      {
        path: 'commonses',
        loadChildren: () => import('./commonses/commonses.module').then(m => m.CommonsesModule),
        resolve: { filterData: FilterOptionsResolver, commonData: CommonDataResolver },
      },
      {
        path: 'common',
        loadChildren: () => import('./commons/comm.module').then(m => m.CommModule)
      },
      {
        path: 'triggers',
        loadChildren: () => import('./triggers/triggers.module').then(m => m.TriggersModule),
        resolve: { filterData: FilterOptionsResolver, commonData: CommonDataResolver },
      },
      {
        path: 'trigger',
        loadChildren: () => import('./trigger/trigger.module').then(m => m.TriggerModule)
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BonusesRoutingModule {

}
