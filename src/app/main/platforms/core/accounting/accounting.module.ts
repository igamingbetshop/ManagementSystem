import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountingComponent } from './accounting.component';
import { FilterOptionsResolver } from '../resolvers/filter-options.resolver';
import { AccountingRoutingModule } from './accounting-routing.module';



@NgModule({
  declarations: [AccountingComponent],
  imports: [
    CommonModule,
    AccountingRoutingModule,
  ],
  providers: [
    FilterOptionsResolver,
  ]
})
export class AccountingModule { }
