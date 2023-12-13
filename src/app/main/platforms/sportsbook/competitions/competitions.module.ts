import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';
import { CompetitionsComponent } from './competitions.component';
import { CompetitionsRoutingModule } from './competitions-routing.module';


@NgModule({
  imports: [
    CommonModule,
    CompetitionsRoutingModule
  ],
  declarations: [CompetitionsComponent],
  providers: [
    SportFilterOptionsResolver,
  ]
})
export class CompetitionsModule { }
