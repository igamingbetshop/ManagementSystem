import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PartnersComponent } from './partners.component';
import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';
import { CommonDataResolver } from '../../core/resolvers/common-data.resolver';

const routes: Routes = [

  {
    path: '',
    component: PartnersComponent,
    children: [
      {
        path: 'partner',
        loadChildren: () => import('./partner/partner.module').then(m => m.PartnerModule)
      },
      {
        path: 'all-partners',
        loadChildren: () => import('./all-partners/all-partners.module').then(m => m.AllPartnersModule),
        resolve: { commonData: CommonDataResolver, filterData: SportFilterOptionsResolver },
      },
      {
        path: '',
        redirectTo: 'all-partners',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartnersRoutingModule {

}
