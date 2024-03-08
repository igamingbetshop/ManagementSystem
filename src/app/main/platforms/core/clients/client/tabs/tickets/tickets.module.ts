import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { AgGridModule } from "ag-grid-angular";
import { TicketsComponent } from "./tickets.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";

import { MatSelectModule } from "@angular/material/select";

import { MatInputModule } from "@angular/material/input";

import { TranslateModule } from "@ngx-translate/core";
import { CoreSignalRService } from "../../../../services/core-signal-r.service";

const routes: Routes = [
  {
    path: '',
    component: TicketsComponent
  }
];

@NgModule({
  declarations: [TicketsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    TranslateModule
  ],
  providers: [DatePipe, CoreSignalRService]
})

export class TicketsModule {

}
