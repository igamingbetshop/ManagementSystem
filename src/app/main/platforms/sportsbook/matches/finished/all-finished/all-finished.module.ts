import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AllFinishedComponent } from './all-finished.component';
import { AllFinishedRoutingModule } from './all-finished-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { AgGridModule } from 'ag-grid-angular';
import { MatInputModule } from "@angular/material/input";
import { PartnerDateFilterComponent } from "../../../../../components/partner-date-filter/partner-date-filter.component";


@NgModule({
    declarations: [AllFinishedComponent],
    providers: [DatePipe],
    imports: [
        CommonModule,
        AllFinishedRoutingModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatSnackBarModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        AgGridModule,
        PartnerDateFilterComponent
    ]
})
export class AllFinishedModule { }
