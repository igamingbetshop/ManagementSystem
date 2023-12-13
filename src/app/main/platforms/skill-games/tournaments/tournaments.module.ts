import {NgModule} from "@angular/core";
import {TournamentsComponent} from "./tournaments.component";
import {CommonModule} from "@angular/common";
import {TournamentsRoutingModule} from "./tournaments-routing.module";

@NgModule({
  imports: [
    CommonModule,
    TournamentsRoutingModule
  ],
  declarations: [TournamentsComponent],
  providers: []
})

export class TournamentsModule {
}
