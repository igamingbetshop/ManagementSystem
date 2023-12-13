import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatTabsModule} from "@angular/material/tabs";
import {PartnerRoutingModule} from "./partner-routing.module";
import {PartnerComponent} from "./partner.component";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [PartnerComponent],
    imports: [
        CommonModule,
        PartnerRoutingModule,
        MatTabsModule,
        TranslateModule
    ]
})

export class PartnerModule {}
