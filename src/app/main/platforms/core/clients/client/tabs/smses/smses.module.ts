import {RouterModule, Routes} from "@angular/router";
import {SmsesComponent} from "./smses.component";
import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {AgGridModule} from "ag-grid-angular";
import {TranslateModule} from "@ngx-translate/core";
import { MatButtonModule } from "@angular/material/button";

const routes: Routes = [
  {
    path: '',
    component: SmsesComponent
  }
];

@NgModule({
  declarations: [SmsesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    TranslateModule,
    MatButtonModule
  ],
  providers: [DatePipe]
})

export class SmsesModule {

}
