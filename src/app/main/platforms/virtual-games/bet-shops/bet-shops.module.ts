import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";
import { BetShopsComponent } from "./bet-shops.component";
import { AgGridModule } from "ag-grid-angular";
import { BetShopsRoutingModule } from "./bet-shops-routing.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { MatSelectModule } from "@angular/material/select";


@NgModule({
  imports: [
    CommonModule,
    BetShopsRoutingModule,
    MatDialogModule,
    FormsModule,
    MatSnackBarModule,
    AgGridModule,
    MatSelectModule,
    TranslateModule
  ],
  declarations: [BetShopsComponent]
})

export class BetShopsModule { }
