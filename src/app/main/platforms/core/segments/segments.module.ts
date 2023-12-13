import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SegmentsComponent } from './segments.component';
import { FilterOptionsResolver } from '../resolvers/filter-options.resolver';
import { CommonDataResolver } from '../resolvers/common-data.resolver';
import { SegmentsRoutingModule } from './segments-routing.module';
import { ClientStatesResolver } from '../resolvers/client-states.resolver';

@NgModule({
  imports: [
    CommonModule,
    SegmentsRoutingModule,
  ],
  declarations: [SegmentsComponent],
  providers: [
    FilterOptionsResolver,
    CommonDataResolver,
    ClientStatesResolver,
  ]
})
export class SegmentsModule { }
