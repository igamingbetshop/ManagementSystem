import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RealTimeComponent } from './real-time.component';
import { RealTimeRoutingModule } from './real-time-routing.module';
import {AgGridModule} from "ag-grid-angular";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatDialogModule} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [RealTimeComponent],
  imports: [
    CommonModule,
    RealTimeRoutingModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    TranslateModule,
    AgGridModule,
  ]

})
export class RealTimeModule { }
