import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketComponent } from './market.component';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AgGridModule } from 'ag-grid-angular';
import {TranslateModule} from "@ngx-translate/core";
import {MatDialogModule} from "@angular/material/dialog";
import { MarketTypesButtonsComponent } from "../../../../../../sb-components/market-types-buttons/market-types-buttons.component";

const routes: Routes = [
  {
    path: '',
    component: MarketComponent
  }
];

@NgModule({
    declarations: [MarketComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        AgGridModule,
        RouterModule.forChild(routes),
        TranslateModule,
        MatDialogModule,
        MarketTypesButtonsComponent
    ]
})
export class MarketModule { }
