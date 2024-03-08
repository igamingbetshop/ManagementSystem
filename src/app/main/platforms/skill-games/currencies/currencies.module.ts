import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {AgGridModule} from "ag-grid-angular";
import {AgBooleanFilterComponent} from "../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import {ButtonRendererComponent} from "../../../components/grid-common/button-renderer.component";
import {NumericEditorComponent} from "../../../components/grid-common/numeric-editor.component";
import {CheckboxRendererComponent} from "../../../components/grid-common/checkbox-renderer.component";
import {CurrenciesComponent} from "./currencies.component";
import {CurrenciesRoutingModule} from "./currencies-routing.module";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  imports: [
    CommonModule,
    CurrenciesRoutingModule,
    MatSnackBarModule,
    AgGridModule,
    TranslateModule
  ],
  declarations: [CurrenciesComponent]
})

export class CurrenciesModule {}
