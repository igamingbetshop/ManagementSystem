import {RouterModule, Routes} from "@angular/router";
import {EmailsComponent} from "./emails.component";
import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {AgGridModule} from "ag-grid-angular";
import {TranslateModule} from "@ngx-translate/core";
import { MatButtonModule } from "@angular/material/button";


const routes: Routes = [
  {
    path: '',
    component: EmailsComponent
  }
];

@NgModule({
  declarations: [EmailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    MatButtonModule,
    TranslateModule
  ],
  providers: [DatePipe]
})
export class EmailsModule {

}
