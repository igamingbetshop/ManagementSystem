import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { ByPlayersComponent } from './by-players.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { PartnerDateFilterComponent } from "../../../../../components/partner-date-filter/partner-date-filter.component";

const routes: Routes = [
  {
    path: '',
    component: ByPlayersComponent,

  }
];

@NgModule({
    declarations: [ByPlayersComponent],
    providers: [DatePipe, DecimalPipe],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        MatSelectModule,
        MatDialogModule,
        ReactiveFormsModule,
        AgGridModule,
        TranslateModule,
        MatButtonModule,
        MatInputModule,
        PartnerDateFilterComponent
    ]
})
export class ByPlayersModule { }
