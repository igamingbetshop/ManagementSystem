import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';
import { MappingsComponent } from './mappings.component';
import { MappingsRoutingModule } from './mappings-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MappingsRoutingModule,
  ],
  declarations: [MappingsComponent],
  providers: [
    SportFilterOptionsResolver,
  ]
})
export class MappingsModule { }
