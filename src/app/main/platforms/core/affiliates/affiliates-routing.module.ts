import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AffiliatesComponent } from './affiliates.component';

const routes: Routes = [
  {
    path:'',
    component: AffiliatesComponent,
    children:[
      {
        path: 'affiliate',
        loadChildren: () => import('./affiliate/affiliate.module').then(m => m.affiliateModule)
      },
      {
        path: 'all-affiliates',
        loadChildren: () => import('./all-affiliates/all-affiliates.module').then(m => m.AllAffiliatesModule),
      },
      {
        path: '',
        redirectTo: 'all-affiliates',
        pathMatch:'full'
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AffiliatesRoutingModule {

}
