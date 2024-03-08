import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {ProductSettingsComponent} from "./product-settings.component";
import {AgGridModule} from "ag-grid-angular";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatButtonModule} from "@angular/material/button";

import {MatFormFieldModule} from "@angular/material/form-field";

import {MatInputModule} from "@angular/material/input";

import {MatSelectModule} from "@angular/material/select";

import {ViewProductSettingComponent} from './view-product-setting/view-product-setting.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {TranslateModule} from "@ngx-translate/core";
import {AgDropdownFilter} from "../../../../../../components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component";
import {AllProductsComponent} from "./componentns/all-products/all-products.component";
import {ProductChangeHistoryComponent} from "./componentns/change-history/product-change-history.component";
import {PartnerProductsComponent} from "./componentns/partner-products/partner-products.component";

const routes: Routes = [
  {
    path: '',
    component: ProductSettingsComponent,
  }, {
    path: ':id',
    component: ViewProductSettingComponent
  }
]

@NgModule({
  declarations: [
    ProductSettingsComponent,
    ViewProductSettingComponent,
    AllProductsComponent,
    ProductChangeHistoryComponent,
    PartnerProductsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatSnackBarModule,
    AgGridModule,
    MatGridListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatCheckboxModule,
    TranslateModule,
    AgDropdownFilter
  ],
  providers: [DatePipe]
})

export class ProductSettingsModule {

}
