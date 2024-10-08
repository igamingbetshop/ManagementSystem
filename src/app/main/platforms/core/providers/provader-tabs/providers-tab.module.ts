import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProvidersTabComponent } from './providers-tab.component';
import { MatTabsModule } from "@angular/material/tabs";
import { ProvidersTabRoutingModule } from './providers-tab-routing.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    ProvidersTabRoutingModule,
    MatTabsModule,
    TranslateModule
  ],
  declarations: [ProvidersTabComponent]
})
export class ProvidersTabModule { }
