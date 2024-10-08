import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AllPartnersComponent } from './all-partners.component';
import { FilterOptionsResolver } from 'src/app/core/services';

const routes: Routes = [
  {
    path: '',
    component: AllPartnersComponent,
    children: [
      {
        path: 'partner',
        loadChildren: () => import('../partner/partner.module').then(m => m.PartnerModule),
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
