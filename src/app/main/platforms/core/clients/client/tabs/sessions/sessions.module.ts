import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import { SessionsComponent } from "./sessions.component";
import {AgGridModule} from "ag-grid-angular";
import { MatDialogModule } from "@angular/material/dialog";
import {SessionModalComponent} from "./session-modal/session-modal.component";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import { MatButtonModule } from "@angular/material/button";
import { PartnerDateFilterComponent } from "../../../../../../components/partner-date-filter/partner-date-filter.component";
import { MatSelectModule } from "@angular/material/select";
import { FormsModule } from "@angular/forms";

const routes: Routes = [
  {
    path: '',
    component: SessionsComponent
  }
];
@NgModule({
  declarations: [SessionsComponent, SessionModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatTableModule,
    MatIconModule,
    TranslateModule,
    AgGridModule,
    MatButtonModule,
    MatSelectModule,
    RouterModule.forChild(routes),
    PartnerDateFilterComponent
],
  providers: [DatePipe]
})
export class SessionsModule
{

}
