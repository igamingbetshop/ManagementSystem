import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllPlayersComponent } from './all-players.component';
import { AllPlayersRoutingModule } from './all-players-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { AgBooleanFilterModule } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.module';
import { AgGridModule } from 'ag-grid-angular';
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    AllPlayersRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    TranslateModule,
    AgBooleanFilterModule,
    FormsModule,
    AgGridModule
  ],
  declarations: [AllPlayersComponent]
})
export class AllPlayersModule { }
