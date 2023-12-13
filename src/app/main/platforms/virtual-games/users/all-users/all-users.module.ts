import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";

import { AgGridModule } from "ag-grid-angular";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { AllUsersRoutingModule } from "./all-users-routing.module";
import { AllUsersComponent } from "./all-users.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AllUsersRoutingModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    AgGridModule,
    TranslateModule,
  ],
  declarations: [AllUsersComponent]
})
export class AllUsersModule { }

