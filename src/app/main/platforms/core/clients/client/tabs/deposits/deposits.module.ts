import { RouterModule, Routes } from "@angular/router";
import { DepositsComponent } from "./deposits.component";
import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { AgGridModule } from "ag-grid-angular";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { MatSelectModule } from '@angular/material/select';
import { PartnerDateFilterComponent } from "../../../../../../components/partner-date-filter/partner-date-filter.component";


const routes: Routes = [
  {
    path: '',
    component: DepositsComponent
  }
];

@NgModule({
    declarations: [DepositsComponent],
    providers: [DatePipe],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        AgGridModule,
        MatFormFieldModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        TranslateModule,
        MatSelectModule,
        PartnerDateFilterComponent
    ]
})

export class DepositsModule {

}
