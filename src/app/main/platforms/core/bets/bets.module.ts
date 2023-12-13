import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonDataResolver } from '../resolvers/common-data.resolver';
import { FilterOptionsResolver } from '../resolvers/filter-options.resolver';
import { BetsComponent } from './bets.component';
import { BetsRoutingModule } from './bets-routing.module';
import { ClientCategoryResolver } from '../resolvers/client-category.resolver';
import { DocumentTypesResolver } from '../resolvers/document-types.resolver';



@NgModule({
  declarations: [BetsComponent],
  imports: [
    CommonModule,
    BetsRoutingModule
  ],
  providers: [
    FilterOptionsResolver,
    CommonDataResolver,
    DocumentTypesResolver,
    ClientCategoryResolver,
  ]
})
export class BetsModule { }
