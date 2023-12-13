import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterOptionsResolver } from 'src/app/main/platforms/core/resolvers/filter-options.resolver';
import { CurrenciesRoutingModule } from './currencies-routing.module';
import { CurrenciesComponent } from './currencies.component';



@NgModule({
  declarations: [CurrenciesComponent],
  imports: [
    CommonModule,
    CurrenciesRoutingModule,
  ],
  providers: [
    FilterOptionsResolver,
  ]
})
export class CurrenciesModule { }
