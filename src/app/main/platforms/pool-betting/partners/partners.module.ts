import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnersComponent } from './partners.component';
import { PartnersRoutingModule } from './partners-routing.module';
import { CommonDataResolver } from 'src/app/core/services';
import { SportFilterOptionsResolver } from '../../sportsbook/resolvers/sport-filter-options.resolver';

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
