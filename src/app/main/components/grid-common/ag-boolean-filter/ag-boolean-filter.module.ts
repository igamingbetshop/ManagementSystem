import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {AgBooleanFilterComponent} from "./ag-boolean-filter.component";


@NgModule({
  declarations: [AgBooleanFilterComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
})
export class AgBooleanFilterModule
{

}
