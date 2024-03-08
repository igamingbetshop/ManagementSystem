import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignInRoutingModule } from './sign-in-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";

import { MatSelectModule } from "@angular/material/select";

import { MatButtonModule } from "@angular/material/button";

import { MatInputModule } from "@angular/material/input";

import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [SignInComponent],
  imports: [
    CommonModule,
    SignInRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule
  ],
  providers: []
})
export class SignInModule {
}
