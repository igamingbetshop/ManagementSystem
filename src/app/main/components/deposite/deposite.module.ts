import { RouterModule, Routes } from "@angular/router";
import { DepositeComponent } from "./deposite.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule } from "@angular/forms";
import { ConfirmPaymentModalComponent } from './confirm-payment-modal/confirm-payment-modal.component';
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import { AgGridModule } from "ag-grid-angular";


const routes: Routes = [
  {
    path: '',
    component: DepositeComponent
  }
];

@NgModule({
  declarations: [DepositeComponent, ConfirmPaymentModalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    TranslateModule,
    AgGridModule
  ],

})

export class DepositeModule {

}
