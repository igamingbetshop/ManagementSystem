import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegionsComponent } from './regions.component';
import { AgGridModule } from 'ag-grid-angular';
import { RegionsRoutingModule } from './regions-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { RegionsInfoComponent } from './grids/regions-info/regions-info.component';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    RegionsRoutingModule,
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    AgGridModule,
    MatButtonModule,
    TranslateModule,
  ],
  declarations: [
    RegionsComponent,
    RegionsInfoComponent
  ],
  providers: [

  ]
})
export class RegionsModule { }
