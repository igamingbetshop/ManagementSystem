import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {UsersComponent} from "./users.component";
import {UsersRouting} from "./users-routing";

@NgModule({
  imports: [
    CommonModule,
    UsersRouting
  ],
  declarations: [UsersComponent]
})
export class UsersModule {
}
