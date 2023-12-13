import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatTabsModule} from "@angular/material/tabs";
import {PlayerComponent} from "./player.component";
import {PlayerRoutingModule} from "./player-routing.module";


@NgModule({
  imports: [
    CommonModule,
    PlayerRoutingModule,
    MatTabsModule,
  ],
  declarations: [PlayerComponent]
})


export class PlayerModule {}
