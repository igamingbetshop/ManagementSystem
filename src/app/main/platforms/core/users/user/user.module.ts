import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { MatTabsModule } from "@angular/material/tabs";
import { UserRoutingModule } from './user-routing.module';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from "@angular-material-components/datetime-picker";
import { TranslateModule } from '@ngx-translate/core';




@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    MatTabsModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    TranslateModule
  ],
  declarations: [UserComponent]
})
export class UserModule { }
