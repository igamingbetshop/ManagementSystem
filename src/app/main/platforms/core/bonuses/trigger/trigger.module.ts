import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TriggerComponent} from './trigger.component';
import {TriggerRoutingModule} from './trigger-routing.module';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  imports: [
    CommonModule,
    TriggerRoutingModule,
    MatTabsModule,
  ],
  declarations: [TriggerComponent]
})
export class TriggerModule {
}
