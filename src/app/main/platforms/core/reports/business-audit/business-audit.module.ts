import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BusinessAuditComponent} from "./business-audit.component";
import {BusinessAuditRoutingModule} from "./business-audit-routing.module";

@NgModule({
  imports: [
    CommonModule,
    BusinessAuditRoutingModule
  ],
  declarations: [BusinessAuditComponent]
})
export class BusinessAuditModule {
}
