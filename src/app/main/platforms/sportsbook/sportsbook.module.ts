import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SportsbookComponent } from "./sportsbook.component";
import { SportsbookRoutingModule } from "./sportsbook-routing.module";
import { SportsbookApiService } from "./services/sportsbook-api.service";
import { SportPartnersResolver } from './resolvers/sport-partners.resolver';
import { SportFilterOptionsResolver } from './resolvers/sport-filter-options.resolver';
import { CoreApiService } from "../core/services/core-api.service";
import { QuickFindComponent } from "../../components/quick-find/quick-find.component";

@NgModule({
  declarations: [SportsbookComponent],
  imports: [
    CommonModule,
    SportsbookRoutingModule,
    QuickFindComponent
  ],
  providers: [
    SportsbookApiService,
    SportPartnersResolver,
    SportFilterOptionsResolver,
    CoreApiService
  ]
})
export class SportsbookModule { }
