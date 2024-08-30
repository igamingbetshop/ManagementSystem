import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonDataResolver, FilterOptionsResolver } from 'src/app/core/services';
import { NotificationsComponent } from './notifications.component';

const routes: Routes = [
  {
    path:'',
    component:NotificationsComponent,
    children:[
      {
        path: 'tickets',
        loadChildren: () => import('./tickets/tickets.module').then(m => m.TicketsModule),
      },
      {
        path: 'ticket',
        loadChildren: () => import('./tickets/ticket/ticket.module').then(m => m.TicketModule),
      },
      {
        path: 'email/client',
        loadChildren: () => import('./emails/emails.module').then(m => m.EmailsModule),
        resolve:{filterData:FilterOptionsResolver , commonData:CommonDataResolver},
      },
      {
        path: 'email/agent',
        loadComponent:()=>import('./emails/agents-emails').then(c=>c.AgentEmailsComponent),
      },
      {
        path: 'email/affiliate',
        loadComponent:()=>import('./emails/affiliates-emails').then(c=>c.AffiliatesEmailsComponent),
      },
      {
        path: 'email/partner',
        loadComponent:()=>import('./emails/partners-emails').then(c=>c.PartnersEmailsComponent),
      },
      {
        path: 'sms/client',
        loadChildren: () => import('./smses/smses.module').then(m => m.SmsesModule),
        resolve:{filterData:FilterOptionsResolver , commonData:CommonDataResolver},
      },
      {
        path: 'sms/agent',
        loadComponent:()=>import('./smses/agents-smses').then(c=>c.AgentSmsesComponent),

      },
      {
        path: 'sms/affiliate',
        loadComponent:()=>import('./smses/agents-smses').then(c=>c.AgentSmsesComponent),

      },
      {
        path: 'announcements',
        loadChildren: () => import('./announcements/announcements.module').then(m => m.AnnouncementsModule),
        resolve:{filterData:FilterOptionsResolver , commonData:CommonDataResolver},
      },
      {
        path: '',
        redirectTo: 'tickets',
        pathMatch:'full'
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class  NotificationsRoutingModule {
}
