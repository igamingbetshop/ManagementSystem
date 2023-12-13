import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsComponent } from './cms.component';
import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';
import { CmsRoutingModule } from './cms-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CmsRoutingModule,
  ],
  declarations: [CmsComponent],
  providers: [
    SportFilterOptionsResolver,
  ]
})
export class CmsModule { }
