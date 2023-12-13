import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchesComponent } from './matches.component';
import { MatchesRoutingModule } from './matches-routing.module';
import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';




@NgModule({
  declarations: [MatchesComponent],
  imports: [
    CommonModule,
    MatchesRoutingModule,
  ],
  providers: [
    SportFilterOptionsResolver,
  ]
})
export class MatchesModule { }
