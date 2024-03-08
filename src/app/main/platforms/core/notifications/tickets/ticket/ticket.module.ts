import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { TicketComponent } from './ticket.component';
import { RouterModule, Routes } from '@angular/router';
import {TranslateModule} from "@ngx-translate/core";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSelectModule} from "@angular/material/select";

import {MatButtonModule} from "@angular/material/button";

import {MatIconModule} from "@angular/material/icon";
import {CoreSignalRService} from "../../../services/core-signal-r.service";
import {FormsModule} from "@angular/forms";

const routes: Routes = [
  {
    path: '',
    component: TicketComponent
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
  declarations: [TicketComponent],
  providers: [CoreSignalRService],
})
export class TicketModule { }
