import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { StringToSpacesPipe } from "../../../../../../../core/pipes/string-to-spases.pipe";

const routes: Routes = [
  {
    path: '',
    component: MainComponent
  }
];

@NgModule({
    declarations: [MainComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatTableModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        TranslateModule,
        RouterModule.forChild(routes),
        StringToSpacesPipe
    ]
})
export class MainModule { }
