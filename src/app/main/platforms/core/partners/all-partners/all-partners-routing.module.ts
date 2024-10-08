import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AllPartnersComponent } from "./all-partners.component";
import { FilterOptionsResolver } from '../../resolvers/filter-options.resolver';

const routes: Routes = [
  {
    path: '',
    component: AllPartnersComponent,
    children: [
      {
        path: 'partner',
        loadChildren: () => import('../partner/partner.module').then(m => m.PartnerModule),
        resolve: { filterData: FilterOptionsResolver },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllPartnersRoutingModule {

}
