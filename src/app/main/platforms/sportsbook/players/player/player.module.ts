import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player.component';
import { PlayerRoutingModule } from './player-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    PlayerRoutingModule,
    MatTabsModule,
    TranslateModule
  ],
  declarations: [PlayerComponent]
})
export class PlayerModule { }
