import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';
import { FilterOptionsResolver } from 'src/app/main/platforms/core/resolvers/filter-options.resolver';



@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
  ],
  providers: [
    FilterOptionsResolver,
  ]
})
export class UsersModule { }
