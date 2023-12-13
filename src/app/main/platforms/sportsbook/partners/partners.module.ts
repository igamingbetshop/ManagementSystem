import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnersComponent } from './partners.component';
import { PartnersRoutingModule } from './partners-routing.module';
import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';
import {CommonDataResolver} from '../../core/resolvers/common-data.resolver';

@NgModule({
  imports: [
    CommonModule,
    PartnersRoutingModule,
  ],
  declarations: [PartnersComponent],
  providers: [
    CommonDataResolver,
    SportFilterOptionsResolver,
  ]
})
export class PartnersModule { }
