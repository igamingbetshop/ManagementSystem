import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatTabsModule} from "@angular/material/tabs";
import {PartnerComponent} from "./partner.component";
import {PartnerRoutingModule} from "./partner-routing.module";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [PartnerComponent],
  imports: [
    CommonModule,
    PartnerRoutingModule,
    MatTabsModule,
    TranslateModule
  ]
})
export class PartnerModule {

}
