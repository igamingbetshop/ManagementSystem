import {RouterModule, Routes} from "@angular/router";
import {ResultsComponent} from "./results.component";
import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {AgGridModule} from "ag-grid-angular";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {ViewResultComponent} from './view-result/view-result.component';
import {MatIconModule} from "@angular/material/icon";
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule} from "@angular-material-components/datetime-picker";
import {OddsTypePipe} from "../../../../../core/pipes/odds-type.pipe";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";


const routes: Routes = [
  {
    path: '',
    component: ResultsComponent
  },
  {
    path: ':id',
    component: ViewResultComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AgGridModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    TranslateModule
  ],
  declarations: [ResultsComponent, ViewResultComponent],
  providers: [DatePipe, OddsTypePipe],
})

export class ResultsModule {
}
