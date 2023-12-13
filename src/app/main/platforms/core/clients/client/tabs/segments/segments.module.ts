import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AgGridModule} from "ag-grid-angular";
import {SegmentsComponent} from "./segments.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {MatSelectModule} from '@angular/material/select';


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
    ReactiveFormsModule,
    TranslateModule,
    MatSelectModule
  ]
})

export class SegmentsModule {

}
