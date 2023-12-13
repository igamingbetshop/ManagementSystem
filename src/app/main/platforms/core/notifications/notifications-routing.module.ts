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
        path: 'emails',
        loadChildren: () => import('./emails/emails.module').then(m => m.EmailsModule),
        resolve:{filterData:FilterOptionsResolver , commonData:CommonDataResolver},
      },
      {
        path: 'partner-emails',
        loadChildren: () => import('./partner-emails/partner-emails.module').then(m => m.PartnerEmailsModule),
        resolve:{filterData:FilterOptionsResolver , commonData:CommonDataResolver},
      },
      {
        path: 'smses',
        loadChildren: () => import('./smses/smses.module').then(m => m.SmsesModule),
        resolve:{filterData:FilterOptionsResolver , commonData:CommonDataResolver},
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
