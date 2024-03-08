import {NgModule} from "@angular/core";
import {PartnersComponent} from "./partners.component";
import {CommonModule} from "@angular/common";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {PartnersRoutingModule} from "./partners-routing.module";
import {SkillGamesFilterOptionsResolver} from "../resolvers/skill-games-filter-options.resolver";

@NgModule({
  declarations: [
    PartnersComponent
  ],
  imports: [
    CommonModule,
    PartnersRoutingModule,
    MatSnackBarModule
  ],
  providers: [
    SkillGamesFilterOptionsResolver
  ]
})


export class PartnersModule {}
