import {RouterModule, Routes} from "@angular/router";
import {FilterOptionsResolver} from "../../resolvers/filter-options.resolver";
import {NgModule} from "@angular/core";
import {BusinessIntelligenceComponent} from "./business-intelligence.component";

const routes: Routes = [

  {
    path: '',
    component: BusinessIntelligenceComponent,
    children: [
      {
        path: 'report-by-providers',
        loadChildren: () => import('./report-by-providers/report-by-providers.module').then(m => m.ReportByProvidersModule),
        resolve: {filterData: FilterOptionsResolver},
      },
      {
        path: 'report-by-partners',
        loadChildren: () => import('./report-by-partners/report-by-partners.module').then(m => m.ReportByPartnersModule),
        resolve: {filterData: FilterOptionsResolver},
      },
      {
        path: 'report-by-client-identity',
        loadChildren: () => import('./report-by-client-identity/report-by-client-identity.module').then(m => m.ReportByClientIdentityModule),
        resolve: {filterData: FilterOptionsResolver},
      },
      {
        path: 'report-by-products',
        loadChildren: () => import('./report-by-products/report-by-products.module').then(m => m.ReportByProductsModule),
        resolve: {filterData: FilterOptionsResolver},
      },
      {
        path: 'report-by-corrections',
        loadChildren: () => import('./report-by-corrections/report-by-corrections.module').then(m => m.ReportByCorrectionsModule),
        resolve: {filterData: FilterOptionsResolver},
      },
      {
        path: 'report-by-payment-system',
        loadChildren: () => import('./report-by-payment-system/report-by-payment-system.module').then(m => m.ReportByPaymentSystemModule),
        resolve: {filterData: FilterOptionsResolver},
      },
      {
        path: '',
        redirectTo: 'report-by-providers',
        pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessIntelligenceRouting {

}
