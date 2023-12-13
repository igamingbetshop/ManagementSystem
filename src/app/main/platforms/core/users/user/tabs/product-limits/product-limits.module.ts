import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AgGridModule} from "ag-grid-angular";
import {ProductLimitsComponent} from "./product-limits.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: ProductLimitsComponent
  }
];

@NgModule({
  declarations: [ProductLimitsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})

export class ProductLimitsModule {

}
