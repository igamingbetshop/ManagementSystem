import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AgGridModule} from "ag-grid-angular";
import {AllUsersComponent} from "./all-users.component";
import {AllUsersRoutingModule} from "./all-users-routing.module";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {MatFormFieldModule} from "@angular/material/form-field";

import {MatSelectModule} from "@angular/material/select";

import {TranslateModule} from "@ngx-translate/core";


@NgModule({
    imports: [
        CommonModule,
        AllUsersRoutingModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatSelectModule,
        AgGridModule,
        TranslateModule
    ],
  declarations: [AllUsersComponent]
})
export class AllUsersModule {}


