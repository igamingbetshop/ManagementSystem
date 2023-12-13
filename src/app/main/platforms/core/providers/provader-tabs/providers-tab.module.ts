import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProvidersTabComponent } from './providers-tab.component';
import { MatTabsModule } from "@angular/material/tabs";
import { ProvidersTabRoutingModule } from './providers-tab-routing.module';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from "@angular-material-components/datetime-picker";




@NgModule({
  imports: [
    CommonModule,
    ProvidersTabRoutingModule,
    MatTabsModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule
  ],
  declarations: [ProvidersTabComponent]
})
export class ProvidersTabModule { }
