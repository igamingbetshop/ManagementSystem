import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PartnersComponent } from './partners.component';
import { CommonDataResolver } from '../../core/resolvers/common-data.resolver';
import { SportFilterOptionsResolver } from '../../sportsbook/resolvers/sport-filter-options.resolver';

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
        resolve: { commonData: CommonDataResolver },
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
