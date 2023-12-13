import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatTabsModule} from "@angular/material/tabs";
import {UserComponent} from "./user.component";
import {UserRoutingModule} from "./user-routing.module";

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    MatTabsModule,
  ],
  declarations: [UserComponent]
})
export class UserModule { }
