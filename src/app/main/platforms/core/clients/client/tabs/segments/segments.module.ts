import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgGridModule } from "ag-grid-angular";
import { SegmentsComponent } from "./segments.component";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from "@angular/material/button";


const routes: Routes = [
  {
    path: '',
    component: SegmentsComponent
  }
];

@NgModule({
  declarations: [SegmentsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    FormsModule,
    MatButtonModule,
    TranslateModule,
    MatSelectModule
  ]
})

export class SegmentsModule {

}
