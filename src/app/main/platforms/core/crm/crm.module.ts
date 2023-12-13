import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmComponent } from './crm.component';
import { FilterOptionsResolver } from '../resolvers/filter-options.resolver';
import { CrmRoutingModule } from './crm-routing.module';




@NgModule({
  declarations: [CrmComponent],
  imports: [
    CommonModule,
    CrmRoutingModule,
  ],
  providers: [
    FilterOptionsResolver,
  ]
})
export class CrmModule { }
