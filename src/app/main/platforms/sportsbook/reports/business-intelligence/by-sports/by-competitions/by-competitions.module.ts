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

const routes: Routes = [
  {
    path: '',
    component: ByCompetitionsComponent,
  }
];

@NgModule({
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
  ],
  declarations: [ByCompetitionsComponent],
  providers: [DatePipe],
})
export class ByCompetitionsModule { }
