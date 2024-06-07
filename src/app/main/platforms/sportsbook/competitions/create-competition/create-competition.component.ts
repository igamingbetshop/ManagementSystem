import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import { take } from 'rxjs/operators';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-create-competition',
  templateUrl: './create-competition.component.html',
  styleUrls: ['./create-competition.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule
  ],
})
export class CreateCompetitionComponent implements OnInit {

  sports: any[] = [];
  providers: any[] = [];
  formGroup: UntypedFormGroup;
  isSendingReqest = false;

  constructor(
    public dialogRef: MatDialogRef<CreateCompetitionComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: SportsbookApiService,
  ) {
  }

  ngOnInit() {
    this.apiService.apiPost('sports').subscribe(data => {
      if (data.Code === 0) {
        this.sports = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
    this.apiService.apiPost('providers').subscribe(data => {
      if (data.Code === 0) {
        this.providers = data.Objects;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
    this.createForm();
  }

  public createForm() {
    this.formGroup = this.fb.group({
      SportId: [null, [Validators.required]],
      RegionId: [null, [Validators.required]],
      Name: [null, [Validators.required]],
      Priority: [null],
      Rating: [null, [Validators.required]],
      AbsoluteLimit: [null, [Validators.required]],
      Delay: [null, [Validators.required]],
      ProviderId: [null, [Validators.required]],
      Enabled: [false],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.isSendingReqest = true;
    const requestBody = this.formGroup.getRawValue();
    this.apiService.apiPost('competitions/add', requestBody).pipe(take(1)).subscribe(data => {
      if (data.Code === 0) {
        this.dialogRef.close(data);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
      this.isSendingReqest = false;
    });
  }
}
