import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreBannerComponent } from './core-banner.component';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from "@angular/material/radio";

const routes: Routes = [
  {
    path: '',
    component: CoreBannerComponent,

  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    FlexLayoutModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule
  ],
  declarations: [CoreBannerComponent]
})
export class CoreBannerModule { }
