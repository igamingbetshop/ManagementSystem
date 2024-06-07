import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from "@angular/material/tabs";
import { PopupRoutingModule } from './popup-routing.module';
import { PopupComponent } from './popup.component';

@NgModule({
  imports: [
    CommonModule,
    PopupRoutingModule,
    MatTabsModule,
  ],
  declarations: [PopupComponent]
})
export class PopupModule { }
