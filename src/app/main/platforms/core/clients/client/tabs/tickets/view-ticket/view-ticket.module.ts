import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {TranslateModule} from "@ngx-translate/core";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSelectModule} from "@angular/material/select";

import {MatButtonModule} from "@angular/material/button";

import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {ViewTicketComponent} from "./view-ticket.component";
import {CoreSignalRService} from "../../../../../services/core-signal-r.service";

const routes: Routes = [
  {
    path: '',
    component: ViewTicketComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  declarations: [ViewTicketComponent],
  providers: [CoreSignalRService],
})
export class ViewTicketModule { }
