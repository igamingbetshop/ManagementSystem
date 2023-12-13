import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentTypeComponent,} from './comment-type.component';
import { AgGridModule } from 'ag-grid-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { CommentTypeRoutingModule } from './comment-type-routing.module';
import { TranslateModule } from "@ngx-translate/core";
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  imports: [
    CommonModule,
    CommentTypeRoutingModule,
    MatDialogModule,
    MatSelectModule,
    AgGridModule,
    TranslateModule,
    MatButtonModule
  ],
  declarations: [CommentTypeComponent]
})
export class CommentTypeModule { }
