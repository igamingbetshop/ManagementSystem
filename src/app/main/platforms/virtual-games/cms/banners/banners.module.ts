import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";
import { AgGridModule } from "ag-grid-angular";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { TranslateModule } from "@ngx-translate/core";
import { MatSelectModule } from "@angular/material/select";
import { BannersComponent } from "./banners.component";
import { MatButtonModule } from "@angular/material/button";

const routes: Routes = [
  {
    path: '',
    component: BannersComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AgGridModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MatButtonModule
  ],
  providers: [DatePipe],
  declarations: [BannersComponent]
})
export class BannersModule {

}
