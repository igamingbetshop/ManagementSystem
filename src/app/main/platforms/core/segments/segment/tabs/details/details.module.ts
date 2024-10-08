import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './details.component';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ClientStatesResolver } from '../../../../resolvers/client-states.resolver';
import { IdToNamePipe } from "../../../../../../../core/pipes/id-to-name-pipe";
import { ConditionInputComponent } from "../../../condition-input/condition-input.component";
import { DateTimePickerComponent } from 'src/app/main/components/data-time-picker/data-time-picker.component';
import { SignUpPeriodPipe } from "../../../../../../../core/pipes/sign-up-period.pipe";

const routes: Routes = [
  {
    path: '',
    component: DetailsComponent
  }
];

@NgModule({
    declarations: [DetailsComponent],
    providers: [
        ClientStatesResolver,
    ],
    imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule.forChild(routes),
    IdToNamePipe,
    ConditionInputComponent,
    DateTimePickerComponent,
    SignUpPeriodPipe
]
})
export class DetailsModule { }
