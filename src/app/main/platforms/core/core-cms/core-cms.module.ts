import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterOptionsResolver } from '../resolvers/filter-options.resolver';
import { CoreCmsComponent } from './core-cms.component';
import { CoreCmsRoutingModule } from './core-cms-routing.module';
import { CommonDataResolver } from '../resolvers/common-data.resolver';


@NgModule({
  declarations: [CoreCmsComponent],
  imports: [
    CommonModule,
    CoreCmsRoutingModule,

  ],
  providers: [
    FilterOptionsResolver,
    CommonDataResolver,
  ]
})
export class CoreCmsModule { }

