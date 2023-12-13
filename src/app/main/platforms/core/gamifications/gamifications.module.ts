import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterOptionsResolver } from 'src/app/main/platforms/core/resolvers/filter-options.resolver';
import { GamificationsRoutingModule } from './gamifications-routing.module';
import { GamificationsComponent } from './gamifications.component';



@NgModule({
  declarations: [GamificationsComponent],
  imports: [
    CommonModule,
    GamificationsRoutingModule,
  ],
  providers: [
    FilterOptionsResolver,
  ]
})
export class GamificationsModule { }
