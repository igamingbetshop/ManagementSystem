import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ClientComponent} from "./client.component";
import {DocumentTypesResolver} from "../../resolvers/document-types.resolver";
import {ClientStatesResolver} from "../../resolvers/client-states.resolver";
import {ClientCategoryResolver} from "../../resolvers/client-category.resolver";

const routes: Routes = [
  {
    path:'',
    component:ClientComponent,
    children:
      [
        {
          path: 'main',
          loadChildren:() => import('./tabs/main/main.module').then(m => m.MainModule),
          resolve:{
            documentTypes:DocumentTypesResolver,
            clientStates:ClientStatesResolver,
            clientCategories:ClientCategoryResolver
          }
        },
        {
          path: 'withdrawals',
          loadChildren:() => import('./tabs/withdrawals/withdrawals.module').then(m => m.WithdrawalsModule)
        },
        {
          path: 'deposits',
          loadChildren:() => import('./tabs/deposits/deposits.module').then(m => m.DepositsModule)
        },
        {
          path: 'object-history',
          loadChildren:() => import('../../../../components/view-object-history/view-object-history.module').then(m => m.ViewObjectHistoryModule)
        },
        {
          path: 'paymentrequests',
          loadChildren:() => import('../../../../components/deposite/deposite.module').then(m => m.DepositeModule)
        },
        {
          path: 'notes',
          loadChildren:() => import('./tabs/notes/notes.module').then(m => m.NotesModule)
        },
        {
          path: 'tickets',
          loadChildren:() => import('./tabs/tickets/tickets.module').then(m => m.TicketsModule)
        },
        {
          path: 'ticket',
          loadChildren:() => import('./tabs/tickets/view-ticket/view-ticket.module').then(m => m.ViewTicketModule)
        },
        {
          path: 'corrections',
          loadChildren:() => import('./tabs/corrections/corrections.module').then(m => m.CorrectionsModule)
        },
        {
          path: 'settings',
          loadChildren:() => import('./tabs/settings/settings.module').then(m => m.SettingsModule)
        },
        {
          path: 'setting',
          loadChildren:() => import('./tabs/settings/setting/setting.module').then(m => m.SettingModule)
        },
        {
          path: 'product-limits',
          loadChildren:() => import('./tabs/product-limits/product-limits.module').then(m => m.ProductLimitsModule)
        },
        {
          path: 'bets',
          loadChildren:() => import('./tabs/bets/bets.module').then(m => m.BetsModule)
        },
        {
          path: 'account-history',
          loadChildren:() => import('./tabs/account-history/account-history.module').then(m => m.AccountHistoryModule),
        },
        {
          path: 'segments',
          loadChildren:() => import('./tabs/segments/segments.module').then(m => m.SegmentsModule),
        },
        {
          path: 'kyc',
          loadChildren:() => import('./tabs/kyc/kyc.module').then(m => m.KycModule),
        },
        {
          path: 'campaigns',
          loadChildren:() => import('./tabs/campaigns/campaigns.module').then(m => m.CampaignsModule),
        },
        {
          path: 'sessions',
          loadChildren:() => import('./tabs/sessions/sessions.module').then(m => m.SessionsModule)
        },
        {
          path: 'payment-settings',
          loadChildren:() => import('./tabs/payment-settings/payment-settings.module').then(m => m.PaymentSettingsModule)
        },
        {
          path: 'payment-info',
          loadChildren:() => import('./tabs/payment-info/payment-info.module').then(m => m.PaymentInfoModule)
        },
        {
          path: 'friends',
          loadChildren:() => import('./tabs/friends/friends.module').then(m => m.FriendsModule)
        },
        {
          path: 'limits-and-exclusions',
          loadChildren:() => import('./tabs/limits-and-exclusions/limits-and-exclusions.module').then(m => m.LimitsAndExclusionsModule)
        },
        {
          path: 'emails',
          loadChildren:() => import('./tabs/emails/emails.module').then(m => m.EmailsModule)
        },
        {
          path: 'smses',
          loadChildren:() => import('./tabs/smses/smses.module').then(m => m.SmsesModule)
        },
        {
          path: 'transactions',
          loadChildren:() => import('./tabs/transactions/transactions.module').then(m => m.TransactionsModule)
        },
        {
          path: 'duplicates',
          loadChildren:() => import('./tabs/duplicates/duplicates.module').then(m => m.DuplicatesModule)
        },
        {
          path: 'provider-settings',
          loadChildren:() => import('./tabs/provider-settings/provider-settings.module').then(m => m.ProviderSettingsModule)
        },
        {
          path: '',
          redirectTo: 'main',
          pathMatch:'full'
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule
{

}
