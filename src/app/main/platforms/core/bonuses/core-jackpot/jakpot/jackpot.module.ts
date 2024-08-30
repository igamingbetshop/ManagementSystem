import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTabsModule} from "@angular/material/tabs";
import { TranslateModule } from '@ngx-translate/core';
import { JackpotRoutingModule } from './jackpot-routing.module';
import { JackpotComponent } from './jackpot.component';

@NgModule({
  declarations: [JackpotComponent],
  imports: [
    CommonModule,
    JackpotRoutingModule,
    MatTabsModule,
    TranslateModule
  ],
  providers:[
  ]
})
export class JackpotModule
{

}
