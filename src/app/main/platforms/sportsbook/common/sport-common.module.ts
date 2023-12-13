import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SportCommonComponent } from './sport-common.component';
import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';
import { SportCommonRoutingModule } from './sport-common.routing.module';
import { CommonDataResolver } from '../../core/resolvers/common-data.resolver';

@NgModule({
  imports: [
    CommonModule,
    SportCommonRoutingModule,
  ],
  declarations: [SportCommonComponent],
  providers: [
    CommonDataResolver,
    SportFilterOptionsResolver,
  ]
})
export class SportCommonModule { }
