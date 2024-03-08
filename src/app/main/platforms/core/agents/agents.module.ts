import {NgModule} from "@angular/core";
import {AgentsComponent} from "./agents.component";
import {FilterOptionsResolver} from "../resolvers/filter-options.resolver";
import {CommonModule} from "@angular/common";
import {AgentsRoutingModule} from "./agents-routing.module";


@NgModule({
  declarations: [AgentsComponent],
  imports: [
    CommonModule,
    AgentsRoutingModule
  ],
  providers: [
    FilterOptionsResolver,
  ]
})

export class AgentsModule {

}
