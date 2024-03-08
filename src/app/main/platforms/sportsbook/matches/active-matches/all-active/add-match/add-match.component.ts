import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from "@ngx-translate/core";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { SportsbookApiService } from '../../../../services/sportsbook-api.service';

@Component({
  standalone: true,
  selector: 'app-add-match',
  templateUrl: './add-match.component.html',
  styleUrls: ['./add-match.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    FlexLayoutModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    AddMatchComponent,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    MatDialogModule
  ],
})
export class AddMatchComponent implements OnInit {
  formGroup: UntypedFormGroup;
  providers: any[] = [];
  competition: any;
  private index = 1;

  TeamIds: TeamInput[] = [{ Id: 1, Value: '' }];

  matchTypes = [
    { id: '1', type: 1, name: 'Usual' },
    { id: '2', type: 2, name: 'Special' }
  ];
  sports: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { sportProviders: any[], competition: any, sports: any[] },
    public dialogRef: MatDialogRef<AddMatchComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: SportsbookApiService,
    public dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    this.providers = this.data.sportProviders;
    this.competition = this.data.competition;
    this.createForm();
    this.sports = this.data.sports
  }

  public createForm() {
    this.formGroup = this.fb.group({
      ProviderId: [null, [Validators.required]],
      SportName: [this.competition.SportName],
      SportId: [this.competition.SportId],
      RegionName: [this.competition.RegionName],
      CompetitionName: [this.competition.Name],
      CompetitionId: [this.competition.CompetitionId],
      StartTime: [new Date(), [Validators.required]],
      ExternalId: [null, [Validators.required]],
      Type: ['1']
    });

    if(this.competition.SportId) {
      this.formGroup.controls['SportId'].disable();
    }
    this.formGroup.controls['RegionName'].disable();
    this.formGroup.controls['CompetitionName'].disable();
  }

  onSelectionChange(event: number) {
    this.sports.forEach((sport) => {
      if (sport.Id === event) {
        this.formGroup.controls['SportName'].setValue(sport.Name);
      }
    });
  }

  onAddTeam() {
    this.index++;
    this.TeamIds.push({ Id: this.index, Value: '' });
  }

  onRemoveTeam(i: number) {
    this.TeamIds.splice(i, 1);
  }

  changeTeam(value: string, i: number) {
    this.TeamIds[i].Value = value;
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }

    const value = this.TeamIds.map((v) => {
      return v.Value;
    }).filter(el => el != '');
    const obj = this.formGroup.getRawValue();
    obj.Type = Number(obj.Type);
    delete obj.RegionName;
    delete obj.CompetitionName;
    obj.TeamIds = value;
    this.dialogRef.close(obj);
  }
}
export interface TeamInput {
  Id: number;
  Value: string;
}


