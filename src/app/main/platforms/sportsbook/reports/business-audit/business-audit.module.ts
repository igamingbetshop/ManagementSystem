import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessAuditComponent } from './business-audit.component';
import { BusinessAuditRoutingModule } from './business-audit-routing.module';
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule} from "@angular-material-components/datetime-picker";


@NgModule({
  imports: [
    CommonModule,
    BusinessAuditRoutingModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
  ],
  declarations: [BusinessAuditComponent]
})
export class BusinessAuditModule { }
