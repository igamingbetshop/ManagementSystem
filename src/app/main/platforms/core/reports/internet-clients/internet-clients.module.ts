import {NgModule} from "@angular/core";
import {InternetClientsComponent} from "./internet-clients.component";
import {CommonModule} from "@angular/common";
import {InternetClientsRoutingModule} from "./internet-clients-routing.module";

@NgModule({
  imports: [
    CommonModule,
    InternetClientsRoutingModule
  ],
  declarations: [InternetClientsComponent]
})
export class InternetClientsModule {
}
