import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AgGridModule } from 'ag-grid-angular';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ByBounusesComponent } from './by-bonuses.component';
import { PartnerDateFilterComponent } from "../../../../../components/partner-date-filter/partner-date-filter.component";

const routes: Routes = [
  {
    path: '',
    component: ByBounusesComponent,
  }
];

@NgModule({
    declarations: [ByBounusesComponent],
    providers: [DatePipe],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        MatSelectModule,
        ReactiveFormsModule,
        AgGridModule,
        TranslateModule,
        MatButtonModule,
        MatInputModule,
        PartnerDateFilterComponent
    ]
})
export class ByBounusesModule { }
