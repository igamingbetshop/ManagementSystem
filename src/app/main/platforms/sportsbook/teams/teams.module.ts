import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsComponent } from './teams.component';
import { TeamsRoutingModule } from './teams-routing.module';
import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';


@NgModule({
  imports: [
    CommonModule,
    TeamsRoutingModule
  ],
  declarations: [TeamsComponent],
  providers: [
    SportFilterOptionsResolver,
  ]
})
export class TeamsModule { }
