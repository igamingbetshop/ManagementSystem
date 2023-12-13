import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {CmsComponent} from "./cms.component";
import {CmsRoutingModule} from "./cms-routing.module";
import {SkillGamesFilterOptionsResolver} from "../resolvers/skill-games-filter-options.resolver";

@NgModule({
  imports: [
    CommonModule,
    CmsRoutingModule,
  ],
  declarations: [CmsComponent],
  providers: [
    SkillGamesFilterOptionsResolver
  ]
})
export class CmsModule {
}
