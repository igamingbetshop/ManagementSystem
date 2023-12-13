import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SegmentComponent } from './segment.component';
import { SegmentRoutingModule } from './segment-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { ClientStatesResolver } from '../../resolvers/client-states.resolver';
import { FilterOptionsResolver } from '../../resolvers/filter-options.resolver';
import { ClientCategoryResolver } from '../../resolvers/client-category.resolver';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    SegmentRoutingModule,
    MatTabsModule,
    TranslateModule
  ],
  declarations: [SegmentComponent],
  providers: [
    FilterOptionsResolver,
    ClientStatesResolver,
    ClientCategoryResolver,
  ]
})
export class SegmentModule { }
