import {RouterModule, Routes} from "@angular/router";
import {FriendsComponent} from "./friends.component";
import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";

import {AgGridModule} from "ag-grid-angular";
import {TranslateModule} from "@ngx-translate/core";
import { MatButtonModule } from "@angular/material/button";

const routes: Routes = [
  {
    path: '',
    component: FriendsComponent
  }
];

@NgModule({
  declarations: [FriendsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    AgGridModule,
    MatButtonModule,
    TranslateModule
  ],
  providers: [DatePipe]
})

export class FriendsModule {

}
