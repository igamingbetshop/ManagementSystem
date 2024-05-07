import {RouterModule, Routes, UrlSegment} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonDataResolver, FilterOptionsResolver, PartnersResolver} from "../../../core/services";
import {CoreComponent} from "./core.component";
import {ClientCategoryResolver} from 'src/app/main/platforms/core/resolvers/client-category.resolver';

export function partnerRouteMatcher(url: UrlSegment[]) {
  const segments = window.location.pathname.split('/');
  if (segments.length)
    return segments[2] === 'partners' ? ({consumed: url}) : null;
  else return null;
}

const routes: Routes = [
    {
      path: '',
      component: CoreComponent,
      children: [
        {
          path: 'clients',
          loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule),
          resolve: {filterOptions: FilterOptionsResolver, commonData: CommonDataResolver, partners: PartnersResolver}
        },
        {
          path: 'dashboard',
          loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
          resolve: {filterOptions: FilterOptionsResolver,commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'affiliates',
          loadChildren: () => import('./affiliates/affiliates.module').then(m => m.AffiliatesModule),
          resolve: {filterOptions: FilterOptionsResolver, commonData: CommonDataResolver, partners: PartnersResolver}
        },
        // {
        //   path: 'clients-categories',
        //   loadChildren: () => import('./client-categories/client-categories.module').then(m => m.ClientCategoriesModule)
        // },
        {
          path: 'users',
          loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'agents',
          loadChildren: () => import('./agents/agents.module').then(m => m.AgentsModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'roles',
          loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'bets',
          loadChildren: () => import('./bets/bets.module').then(m => m.BetsModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'segments',
          loadChildren: () => import('./segments/segments.module').then(m => m.SegmentsModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'notifications',
          loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'currencies',
          loadChildren: () => import('./currencies/currencies.module').then(m => m.CurrenciesModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'providers',
          loadChildren: () => import('./providers/providers.module').then(m => m.ProvidersModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'product-categories',
          loadChildren: () => import('./product-categories/product-categories.module').then(m => m.ProductCategoriesModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'product-edit',
          loadChildren: () => import('./product-edit/product-edit.module').then(m => m.ProductEditModule),
           resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'bet-shop-groups',
          loadChildren: () => import('./bet-shops-edit/bet-shops-edit.module').then(m => m.BetShopsEditModule),
           resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'products',
          loadChildren: () => import('./products/products.module').then(m => m.ProductsModule),
           resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'payments',
          loadChildren: () => import('./payments/payments.module').then(m => m.PaymentsModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver, filterOptions: FilterOptionsResolver,},
        },
        {
          path: 'bonuses',
          loadChildren: () => import('./bonuses/bonuses.module').then(m => m.BonusesModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'accounting',
          loadChildren: () => import('./accounting/accounting.module').then(m => m.AccountingModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'reports/internet-clients',
          loadChildren: () => import('./reports/internet-clients/internet-clients.module').then(m => m.InternetClientsModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'reports/betshops',
          loadChildren: () => import('./reports/betshops/betshops.module').then(m => m.BetshopsModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'reports/business-intelligence',
          loadChildren: () => import('./reports/business-intelligence/business-intelligence.module').then(m => m.BusinessIntelligenceModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'reports/users',
          loadChildren: () => import('./reports/users/users.module').then(m => m.UsersModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'reports/agents',
          loadChildren: () => import('./reports/agents/agents.module').then(m => m.AgentsModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'reports/business-audit',
          loadChildren: () => import('./reports/business-audit/business-audit.module').then(m => m.BusinessAuditModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'reports/accounting',
          loadChildren: () => import('./reports/accounting/accounting.module').then(m => m.AccountingModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'cms',
          loadChildren: () => import('./core-cms/core-cms.module').then(m => m.CoreCmsModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'crm',
          loadChildren: () => import('./crm/crm.module').then(m => m.CrmModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'real-time',
          loadChildren: () => import('./real-time/real-time.module').then(m => m.RealTimeModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver, clientCategory: ClientCategoryResolver}
        },
        {
          path: 'partners',
          loadChildren: () => import('./partners/partners.module').then(m => m.PartnersModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: 'gamifications',
          loadChildren: () => import('./gamifications/gamifications.module').then(m => m.GamificationsModule),
          resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
        },
        {
          path: '',
          redirectTo: 'dashboard',
          pathMatch: 'full'
        }
      ]
    }
  ]
;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {
}
