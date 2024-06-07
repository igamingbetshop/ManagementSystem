import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProvidersTabComponent } from './providers-tab.component';
import { MatTabsModule } from "@angular/material/tabs";
import { ProvidersTabRoutingModule } from './providers-tab-routing.module';


@NgModule({
  imports: [
    CommonModule,
    ProvidersTabRoutingModule,
    MatTabsModule,
  ],
  declarations: [ProvidersTabComponent]
})
export class ProvidersTabModule { }
