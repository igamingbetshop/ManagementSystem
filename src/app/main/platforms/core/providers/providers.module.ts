import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterOptionsResolver } from 'src/app/main/platforms/core/resolvers/filter-options.resolver';
import { ProvidersComponent } from './providers.component';
import { ProvidersRoutingModule } from './providers-routing.module';



@NgModule({
  declarations: [ProvidersComponent],
  imports: [
    CommonModule,
    ProvidersRoutingModule,
  ],
  providers: [
    FilterOptionsResolver,
  ]
})
export class ProvidersModule { }
