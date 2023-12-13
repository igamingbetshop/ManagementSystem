import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatTabsModule} from "@angular/material/tabs";
import { RoleRoutingModule } from './role-routing.module';
import { RoleComponent } from './role.component';



@NgModule({
  imports: [
    CommonModule,
    RoleRoutingModule,
    MatTabsModule,
  ],
  declarations: [RoleComponent]
})
export class RoleModule { }
