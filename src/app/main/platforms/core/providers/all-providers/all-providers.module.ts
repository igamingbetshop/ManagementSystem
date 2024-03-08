import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllProvidersComponent } from './all-providers.component';
import { AllProvidersRoutingModule } from './all-providers-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { AgBooleanFilterModule } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatMenuModule } from '@angular/material/menu';
import { DropdownDirective } from 'src/app/core/directives/dropdown.directive';

@NgModule({
  imports: [
    CommonModule,
    AllProvidersRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    TranslateModule,
    AgBooleanFilterModule,
    AgGridModule,
    DropdownDirective,
    MatMenuModule
  ],
  declarations: [AllProvidersComponent]
})
export class AllProvidersModule { }
