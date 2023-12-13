import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from "./core.component";
import { CoreApiService } from "./services/core-api.service";
import { FilterOptionsResolver } from "./resolvers/filter-options.resolver";
import { CommonDataResolver } from "./resolvers/common-data.resolver";
import { PartnersResolver } from "./resolvers/partners.resolver";
import { ClientCategoryResolver } from "./resolvers/client-category.resolver";
import { QuickFindComponent } from "../../components/quick-find/quick-find.component";


@NgModule({
  declarations: [CoreComponent],
  imports: [
    CommonModule,
    CoreRoutingModule,
    QuickFindComponent
  ],
  providers: [
    CoreApiService,
    FilterOptionsResolver,
    CommonDataResolver,
    PartnersResolver,
    ClientCategoryResolver,
  ]
})
export class CoreModule {
}
