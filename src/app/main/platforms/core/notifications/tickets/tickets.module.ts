import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TicketsComponent } from './tickets.component';
import { TicketsRoutingModule } from './tickets-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { AgBooleanFilterModule } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CoreSignalRService } from "../../services/core-signal-r.service";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { PartnerDateFilterComponent } from "../../../../components/partner-date-filter/partner-date-filter.component";

@NgModule({
    declarations: [TicketsComponent],
    providers: [DatePipe, CoreSignalRService],
    imports: [
        CommonModule,
        TicketsRoutingModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatSnackBarModule,
        MatCheckboxModule,
        TranslateModule,
        AgBooleanFilterModule,
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        AgGridModule,
        PartnerDateFilterComponent
    ]
})
export class TicketsModule { }
