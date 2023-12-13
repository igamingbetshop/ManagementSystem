import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from "@angular/material/tabs";
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';




@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatTabsModule,
  ],
  declarations: [ProfileComponent]
})
export class ProfileModule { }
