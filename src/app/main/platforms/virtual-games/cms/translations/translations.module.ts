import {Routes} from "@angular/router";
import {TranslationsComponent} from "./translations.component";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AgGridModule} from "ag-grid-angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { TranslationsRoutingModule } from "./translations-routing.module";
import { TranslateModule } from "@ngx-translate/core";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";

const routes: Routes = [
  {
    path: '',
    component: TranslationsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    TranslationsRoutingModule,
    TranslateModule,
    AgGridModule,
    MatSelectModule,
    MatInputModule,
    FormsModule
  ],
  declarations: [TranslationsComponent]
})
export class TranslationsModule {}
