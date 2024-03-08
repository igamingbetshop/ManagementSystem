import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PartnerLevelsRoutingModule} from "./partner-levels-routing.module";
import {FormsModule} from "@angular/forms";
import {PartnerLevelsComponent} from "./partner-levels.component";
import {MatSliderModule} from "@angular/material/slider";
import {TranslateModule} from "@ngx-translate/core";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [PartnerLevelsComponent],
    imports: [
        CommonModule,
        PartnerLevelsRoutingModule,
        FormsModule,
        TranslateModule,
        MatSliderModule,
        MatIconModule,
    ]
})

export class PartnerLevelsModule {

}
