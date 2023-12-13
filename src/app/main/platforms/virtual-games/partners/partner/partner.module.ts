import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatTabsModule} from "@angular/material/tabs";
import {PartnerRoutingModule} from "./partner-routing.module";
import {PartnerComponent} from "./partner.component";

@NgModule({
  declarations: [PartnerComponent],
  imports: [
    CommonModule,
    PartnerRoutingModule,
    MatTabsModule
  ]
})

export class PartnerModule {}
