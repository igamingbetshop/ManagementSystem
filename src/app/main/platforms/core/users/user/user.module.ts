import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { MatTabsModule } from "@angular/material/tabs";
import { UserRoutingModule } from './user-routing.module';
import { TranslateModule } from '@ngx-translate/core';




@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    MatTabsModule,
    TranslateModule
  ],
  declarations: [UserComponent]
})
export class UserModule { }
