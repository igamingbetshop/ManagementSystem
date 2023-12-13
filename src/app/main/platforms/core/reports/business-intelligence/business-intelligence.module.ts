import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BusinessIntelligenceComponent} from "./business-intelligence.component";
import {BusinessIntelligenceRouting} from "./business-intelligence-routing";

@NgModule({
  imports: [
    CommonModule,
    BusinessIntelligenceRouting
  ],
  declarations: [BusinessIntelligenceComponent]
})
export class BusinessIntelligenceModule {
}
