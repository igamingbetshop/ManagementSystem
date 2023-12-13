import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PartnerComponent} from "./partner.component";

const routes: Routes = [
  {
    path: '',
    component: PartnerComponent,
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch:'full'
      },
      {
        path: 'main',
        loadChildren: () => import('./tabs/main/main-module').then(m => m.MainModule),
      },
      {
        path: 'payment-settings',
        loadChildren: () => import('./tabs/payment-settings/payment-settings.module').then(m => m.PaymentSettingsModule),
      },
      {
        path: 'product-settings',
        loadChildren: () => import('./tabs/product-settings/product-settings.module').then(m => m.ProductSettingsModule),
      },
      {
        path: 'currency-settings',
        loadChildren: () => import('./tabs/currency-settings/currency-settings.module').then(m => m.CurrencySettingsModule),
      },
      {
        path: 'language-settings',
        loadChildren: () => import('./tabs/language-settings/language-settings.module').then(m => m.LanguageSettingsModule),
      },
      {
        path: 'provider-settings',
        loadChildren: () => import('./tabs/provider-settings/provider-settings.module').then(m => m.ProviderSettingsModule),
      },
      {
        path: 'product-limits',
        loadChildren: () => import('./tabs/product-limits/product-limits.module').then(m => m.ProductLimitsModule),
      },
      {
        path: 'payment-limits',
        loadChildren: () => import('./tabs/payment-limits/payment-limits.module').then(m => m.PaymentLimitsModule),
      },
      {
        path: 'complimentary-point-rates',
        loadChildren: () => import('./tabs/complimentary-point-rates/complimentary-point-rates.module').then(m => m.ComplimentaryPointRatesModule),
      },
      {
        path: 'payment-info',
        loadChildren: () => import('./tabs/payment-info/payment-info.module').then(m => m.PaymentInfoModule),
      },
      {
        path: 'country-settings',
        loadChildren: () => import('./tabs/country-settings/country-settings.module').then(m => m.CountrySettingsModule),
      },
      {
        path: 'web-site-settings',
        loadChildren: () => import('./tabs/web-site-settings/web-site-settings.module').then(m => m.WebSiteSettingsModule),
      },
      {
        path: 'keys',
        loadChildren: () => import('./tabs/keys/keys.module').then(m => m.KeysModule),
      }

    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartnerRoutingModule {

}
