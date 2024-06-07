import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterOptionsResolver } from 'src/app/main/platforms/core/resolvers/filter-options.resolver';
import { NotificationsComponent } from './notifications.component';
import { CommonDataResolver } from '../resolvers/common-data.resolver';
import { NotificationsRoutingModule } from './notifications-routing.module';




@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
  ],
  providers: [
    FilterOptionsResolver,
    CommonDataResolver,
  ]
})
export class NotificationsModule { }
