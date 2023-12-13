import { Routes } from "@angular/router";
import { TranslationsComponent } from "./translations.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgGridModule } from "ag-grid-angular";
import { ButtonRendererComponent } from "../../../../components/grid-common/button-renderer.component";
import { TextEditorComponent } from "../../../../components/grid-common/text-editor.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { TranslateModule } from "@ngx-translate/core";
import { MatDialogModule } from "@angular/material/dialog";
import { TranslationsRoutingModule } from "./translations-routing.module";

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
export class TranslationsModule { }
