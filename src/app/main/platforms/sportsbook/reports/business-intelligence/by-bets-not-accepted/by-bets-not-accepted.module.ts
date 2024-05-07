import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';

import { ByBetsNotAcceptedComponent } from './by-bets-not-accepted.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { PartnerDateFilterComponent } from "../../../../../components/partner-date-filter/partner-date-filter.component";
import { SelectionsGridComponent } from './selections-grid/selections-grid.component';


const routes: Routes = [
  {
    path: '',
    component: ByBetsNotAcceptedComponent,

  }
];

@NgModule({
    declarations: [ByBetsNotAcceptedComponent, SelectionsGridComponent],
    providers: [DatePipe, DecimalPipe],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        TranslateModule,
        MatSelectModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        AgGridModule,
        MatButtonModule,
        MatInputModule,
        PartnerDateFilterComponent
    ]
})
export class ByBetsNotAcceptedModule { }
