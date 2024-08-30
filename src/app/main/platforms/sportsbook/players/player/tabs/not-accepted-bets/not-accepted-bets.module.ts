import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SelectionsGridComponent } from './selections-grid/selections-grid.component';
import { PartnerDateFilterComponent } from 'src/app/main/components/partner-date-filter/partner-date-filter.component';
import { NotAcceptedBetsComponent } from './not-accepted-bets.component';


const routes: Routes = [
  {
    path: '',
    component: NotAcceptedBetsComponent,

  }
];

@NgModule({
    declarations: [NotAcceptedBetsComponent, SelectionsGridComponent],
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
export class NotAcceptedBetsModule { }
