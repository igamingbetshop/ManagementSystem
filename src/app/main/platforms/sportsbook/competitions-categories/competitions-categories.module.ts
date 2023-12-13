import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompetitionsCategoriesComponent } from './competitions-categories.component';
import { CompetitionsCategoriesRoutingModule } from './competitions-categories-routing.module';
import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';

@NgModule({
  imports: [
    CommonModule,
    CompetitionsCategoriesRoutingModule
  ],
  declarations: [CompetitionsCategoriesComponent],
  providers: [
    SportFilterOptionsResolver,
  ]
})
export class CompetitionsCategoriesModule { }
