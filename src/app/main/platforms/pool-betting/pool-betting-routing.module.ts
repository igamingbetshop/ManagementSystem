import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PoolBettingComponent } from './pool-betting.component';
import { CommonDataResolver } from 'src/app/core/services';
import { PBPartnersResolver } from './resolvers/pb-partners.resolver';


const routes: Routes = [
  {
    path: '',
    component: PoolBettingComponent,
    children: [
      {
        path: 'pools',
        loadChildren: () => import('./all-pool-betting/all-pool-betting.module').then(m => m.AllPoolBettingModule),
      },
      {
        path: 'partners',
        loadChildren: () => import('./partners/partners.module').then(m => m.PartnersModule),
        resolve:{commonData: CommonDataResolver, filterData: PBPartnersResolver},
      },
      {
        path: 'cms',
        loadChildren: () => import('./cms/cms.module').then(m => m.CmsModule),
        // resolve:{commonData: CommonDataResolver, filterData: PBPartnersResolver},
      },
      {
        path: '',
        redirectTo: 'pools',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoolBettingRoutingModule { }
