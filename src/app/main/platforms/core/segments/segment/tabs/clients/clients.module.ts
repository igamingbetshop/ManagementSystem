import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ClientsComponent } from './clients.component';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {TranslateModule} from "@ngx-translate/core";
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: ClientsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatSelectModule,
    FormsModule,
    RouterModule.forChild(routes),
    AgGridModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule
  ],
  declarations: [ClientsComponent],
  providers: [DatePipe],
})
export class ClientsModule { }
