import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { ByCompetitionsComponent } from './by-competitions.component';
import { PartnerDateFilterComponent } from "../../../../../../components/partner-date-filter/partner-date-filter.component";

const routes: Routes = [
  {
    path: '',
    component: ByCompetitionsComponent,
  }
];

@NgModule({
    declarations: [ByCompetitionsComponent],
    providers: [DatePipe],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        AgGridModule,
        FormsModule,
        MatSelectModule,
        MatButtonModule,
        TranslateModule,
        MatInputModule,
        PartnerDateFilterComponent
    ]
})
export class ByCompetitionsModule { }
