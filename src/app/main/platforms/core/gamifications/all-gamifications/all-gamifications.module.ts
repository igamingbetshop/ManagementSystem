import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { AgBooleanFilterModule } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AllGamificationsComponent } from './all-gamifications.component';
import { AllGamificationsRoutingModule } from './all-gamifications-routing.module';
import { CharacterChildsComponent } from './character-childs/character-childs.component';
import { DetailCellRendererComponent } from './character-childs/detail-cell-renderer/detail-cell-renderer.component';

@NgModule({
  imports: [
    CommonModule,
    AllGamificationsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSnackBarModule,
    TranslateModule,
    AgBooleanFilterModule,
    AgGridModule,
  ],
  declarations: [AllGamificationsComponent, CharacterChildsComponent, DetailCellRendererComponent]
})
export class AllGamificationsModule { }
