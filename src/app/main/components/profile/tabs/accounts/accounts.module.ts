import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsComponent } from './accounts.component';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AgGridModule } from 'ag-grid-angular';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { CoreApiService } from 'src/app/main/platforms/core/services/core-api.service';
import { PartnerDateFilterComponent } from "../../../partner-date-filter/partner-date-filter.component";

const routes: Routes = [
  {
    path: '',
    component: AccountsComponent
  }
];

@NgModule({
    declarations: [AccountsComponent],
    providers: [
        CoreApiService
    ],
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
        MatNativeDateModule,
        TranslateModule,
        MatDatepickerModule,
        RouterModule.forChild(routes),
        AgGridModule,
        PartnerDateFilterComponent
    ]
})
export class AccountsModule { }
