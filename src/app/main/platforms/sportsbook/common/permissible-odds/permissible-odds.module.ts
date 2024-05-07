import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissibleOddsComponent } from './permissible-odds.component';
import { AgGridModule } from 'ag-grid-angular';
import { PermissibleOddsRoutingModule } from './permissible-odds-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    PermissibleOddsRoutingModule,
    MatSelectModule,
    MatButtonModule,
    AgGridModule,
    TranslateModule,
    MatDialogModule,
  ],
  declarations:[
    PermissibleOddsComponent,
  ],
   providers:[

  ]
})
export class PermissibleOddsModule { }
