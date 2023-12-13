import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VirtualGamesComponent } from "./virtual-games.component";
import { VirtualGamesRoutingModule } from "./virtual-games-routing.module";
import { VirtualGamesApiService } from "./services/virtual-games-api.service";
import { VirtualGamesPartnersResolver } from "./resolvers/virtual-games-partners.resolver";
import { VirtualGamesFilterOptionsResolver } from "./resolvers/virtual-games-filter-options.resolver";
import { QuickFindComponent } from "../../components/quick-find/quick-find.component";
import { CoreApiService } from "../core/services/core-api.service";

@NgModule({
  declarations: [VirtualGamesComponent],
  imports: [
    CommonModule,
    VirtualGamesRoutingModule,
    QuickFindComponent
  ],
  providers: [
    VirtualGamesApiService,
    VirtualGamesPartnersResolver,
    VirtualGamesFilterOptionsResolver,
    CoreApiService
  ]
})
export class VirtualGamesModule { }
