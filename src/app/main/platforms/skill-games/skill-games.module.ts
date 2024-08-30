import { NgModule } from "@angular/core";
import { SkillGamesComponent } from "./skill-games.component";
import { CommonModule } from "@angular/common";
import { SkillGamesRoutingModule } from "./skill-games-routing.module";
import { SkillGamesApiService } from "./services/skill-games-api.service";
import { SkillGamesPartnersResolver } from "./resolvers/skill-games-partners.resolver";
import { SkillGamesFilterOptionsResolver } from "./resolvers/skill-games-filter-options.resolver";
import { QuickFindComponent } from "../../components/quick-find/quick-find.component";
import { CoreApiService } from "../core/services/core-api.service";
import { SBQuickFindComponent } from "../../components/sb-quick-find/sb-quick-find.component";

@NgModule({
    declarations: [SkillGamesComponent],
    providers: [
        SkillGamesApiService,
        SkillGamesPartnersResolver,
        SkillGamesFilterOptionsResolver,
        CoreApiService
    ],
    imports: [
        CommonModule,
        SkillGamesRoutingModule,
        QuickFindComponent,
        SBQuickFindComponent
    ]
})
export class SkillGamesModule {

}
