import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommComponent } from './comm.component';
import { CommRoutingModule } from './comm-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import {MatSnackBarModule} from "@angular/material/snack-bar";

import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    CommRoutingModule,
    MatTabsModule,
    TranslateModule,
    MatSnackBarModule,
  ],
  declarations: [CommComponent]
})
export class CommModule { }
