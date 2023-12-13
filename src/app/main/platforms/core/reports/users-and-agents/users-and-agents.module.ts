import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {UsersAndAgentsComponent} from "./users-and-agents.component";
import {UsersAndAgentsRouting} from "./users-and-agents-routing";

@NgModule({
  imports: [
    CommonModule,
    UsersAndAgentsRouting
  ],
  declarations: [UsersAndAgentsComponent]
})
export class UsersAndAgentsModule {
}
