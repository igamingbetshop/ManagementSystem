import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AgentsComponent} from "./agents.component";
import {AgentsRouting} from "./agents-routing";

@NgModule({
  imports: [
    CommonModule,
    AgentsRouting
  ],
  declarations: [AgentsComponent]
})
export class AgentsModule {
}
