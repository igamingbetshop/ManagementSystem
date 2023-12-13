import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterOptionsResolver } from 'src/app/main/platforms/core/resolvers/filter-options.resolver';
import { NotificationsComponent } from './notifications.component';
import { CommonDataResolver } from '../resolvers/common-data.resolver';
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule} from "@angular-material-components/datetime-picker";
import { NotificationsRoutingModule } from './notifications-routing.module';




@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule
  ],
  providers: [
    FilterOptionsResolver,
    CommonDataResolver,
  ]
})
export class NotificationsModule { }
