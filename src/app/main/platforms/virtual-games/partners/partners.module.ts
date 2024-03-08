import {NgModule} from "@angular/core";
import {PartnersComponent} from "./partners.component";
import {CommonModule} from "@angular/common";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {PartnersRoutingModule} from "./partners-routing.module";
import {VirtualGamesFilterOptionsResolver} from "../resolvers/virtual-games-filter-options.resolver";

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
    VirtualGamesFilterOptionsResolver
  ]
})


export class PartnersModule {}
