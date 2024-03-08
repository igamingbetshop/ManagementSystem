import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PartnersRoutingModule} from "./partners-routing.module";
import {PartnersComponent} from "./partners.component";
import {DocumentTypesResolver} from "../resolvers/document-types.resolver";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {FilterOptionsResolver} from "../resolvers/filter-options.resolver";


@NgModule({
  declarations: [
    PartnersComponent
  ],
  imports: [
    CommonModule,
    PartnersRoutingModule,
    MatSnackBarModule
  ],
  providers: [
    // DocumentTypesResolver,
    FilterOptionsResolver
  ]
})
export class PartnersModule {
}
