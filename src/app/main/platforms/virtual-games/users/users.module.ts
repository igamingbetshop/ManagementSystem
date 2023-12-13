import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {UsersComponent} from "./users.component";
import {UsersRoutingModule} from "./users-routing.module";
import {VirtualGamesFilterOptionsResolver} from "../resolvers/virtual-games-filter-options.resolver";
import {VirtualGamesPartnersResolver} from "../resolvers/virtual-games-partners.resolver";

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule
  ],
  providers: [
    VirtualGamesFilterOptionsResolver,
    VirtualGamesPartnersResolver
  ]
})
export class UsersModule {
}
