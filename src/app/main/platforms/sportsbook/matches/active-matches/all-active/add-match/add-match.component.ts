import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

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
import { SportsbookApiService } from '../../../../services/sportsbook-api.service';
import { take } from 'rxjs';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { DateTimePickerComponent } from 'src/app/main/components/data-time-picker/data-time-picker.component';

@Component({
  standalone: true,
  selector: 'app-add-match',
  templateUrl: './add-match.component.html',
  styleUrls: ['./add-match.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
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
    MatDialogModule,
    DateTimePickerComponent
  ],
})
export class AddMatchComponent implements OnInit {
  formGroup: UntypedFormGroup;
  providers: any[] = [];
  competition: any;
  private index = 1;
  isSendingReqest = false;
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

    if (this.competition.SportId) {
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
    this.isSendingReqest = true;
    const value = this.TeamIds.map((v) => {
      return v.Value;
    }).filter(el => el != '');
    const obj = this.formGroup.getRawValue();
    obj.Type = Number(obj.Type);
    delete obj.RegionName;
    delete obj.CompetitionName;
    obj.TeamIds = value;

    this.apiService.apiPost('matches/creatematch', obj)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.dialogRef.close(true);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

}
export interface TeamInput {
  Id: number;
  Value: string;
}


