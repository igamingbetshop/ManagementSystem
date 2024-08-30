import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VirtualGamesComponent } from "./virtual-games.component";
import { VirtualGamesRoutingModule } from "./virtual-games-routing.module";
import { VirtualGamesApiService } from "./services/virtual-games-api.service";
import { VirtualGamesPartnersResolver } from "./resolvers/virtual-games-partners.resolver";
import { VirtualGamesFilterOptionsResolver } from "./resolvers/virtual-games-filter-options.resolver";
import { QuickFindComponent } from "../../components/quick-find/quick-find.component";
import { CoreApiService } from "../core/services/core-api.service";
import { SBQuickFindComponent } from "../../components/sb-quick-find/sb-quick-find.component";

@NgModule({
    declarations: [VirtualGamesComponent],
    providers: [
        VirtualGamesApiService,
        VirtualGamesPartnersResolver,
        VirtualGamesFilterOptionsResolver,
        CoreApiService
    ],
    imports: [
        CommonModule,
        VirtualGamesRoutingModule,
        QuickFindComponent,
        SBQuickFindComponent
    ]
})
export class VirtualGamesModule { }
