import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {PaymentLimitsComponent} from "./payment-limits.component";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatInputModule} from "@angular/material/input";

import {MatButtonModule} from "@angular/material/button";

import {TranslateModule} from "@ngx-translate/core";
import { MatDialogModule } from "@angular/material/dialog";

const routes: Routes = [
  {
    path: '',
    component: PaymentLimitsComponent,
  }
]

@NgModule({
  declarations: [PaymentLimitsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatSnackBarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule,

  ]
})

export class PaymentLimitsModule {

}
