import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AffiliatesComponent } from './affiliates.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AffiliatesRoutingModule } from "./affiliates-routing.module";
import { FilterOptionsResolver } from '../resolvers/filter-options.resolver';

@NgModule({
  declarations: [
    AffiliatesComponent
  ],
  imports: [
    CommonModule,
    AffiliatesRoutingModule
  ],
  providers: [
    FilterOptionsResolver
  ]
})

export class AffiliatesModule {
}
