import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TriggersGroupComponent} from './triggers-group.component';
import {RouterModule, Routes} from '@angular/router';
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";
import { AddTriggerToGroupComponent } from './add-trigger-to-group/add-trigger-to-group.component';
import { CreateTriggerGroupComponent } from './create-trigger-group/create-trigger-group.component';
import {MatButtonModule} from "@angular/material/button";

import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";

import {MatInputModule} from "@angular/material/input";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: TriggersGroupComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [TriggersGroupComponent, AddTriggerToGroupComponent, CreateTriggerGroupComponent]
})
export class TriggersGroupModule {
}
