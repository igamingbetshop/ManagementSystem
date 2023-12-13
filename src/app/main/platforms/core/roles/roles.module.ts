import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterOptionsResolver } from 'src/app/main/platforms/core/resolvers/filter-options.resolver';
import { RolesComponent } from './roles.component';
import { RolesRoutingModule } from './roles-routing.module';



@NgModule({
  declarations: [RolesComponent],
  imports: [
    CommonModule,
    RolesRoutingModule,
  ],
  providers: [
    FilterOptionsResolver,
  ]
})
export class RolesModule { }
