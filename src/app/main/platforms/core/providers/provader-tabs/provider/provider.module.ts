import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderComponent } from './provider.component';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { AgBooleanFilterModule } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.module';
import { AgGridModule } from 'ag-grid-angular';
import {FormsModule} from "@angular/forms";
import {MatSelectModule} from '@angular/material/select';



const routes: Routes = [
  {
    path: '',
    component: ProviderComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSnackBarModule,
    TranslateModule,
    AgBooleanFilterModule,
    MatSelectModule,
    AgGridModule,
    FormsModule
  ],
  declarations: [ProviderComponent]
})
export class ProviderModule { }
