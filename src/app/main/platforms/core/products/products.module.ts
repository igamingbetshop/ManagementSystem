import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { FilterOptionsResolver } from '../resolvers/filter-options.resolver';
import { ProductsRoutingModule } from './products-routing.module';



@NgModule({
  declarations: [ProductsComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
  ],
  providers: [
    FilterOptionsResolver,
  ]
})
export class ProductsModule { }
