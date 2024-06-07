import {CommonModule} from '@angular/common';
import {Component, NgModule, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {SportsbookApiService} from '../../../services/sportsbook-api.service';
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {take} from 'rxjs/operators';
import {MatInputModule} from '@angular/material/input';

import {MatButtonModule} from '@angular/material/button';

import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss']
})
export class AddTeamComponent implements OnInit {

  formGroup: UntypedFormGroup;
  sports: any[] = [];
  isSendingReqest = false;

  constructor(
    public dialogRef: MatDialogRef<AddTeamComponent>,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
  ) {
  }

  ngOnInit() {
    this.apiService.apiPost('sports').subscribe(data => {
      if (data.Code === 0) {
        this.sports = data.ResponseObject.sort((a, b) => a.Priority - b.Priority);
        this.sports.forEach(el => {
          // console.log(el.Name);
          // console.log(el.Priority);
        })
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    })
    this.createForm();
  }

  public createForm() {

    this.formGroup = this.fb.group({
      SportId: [null, [Validators.required]],
      Name: [null, [Validators.required]],
      TypeId: [null, [Validators.required]],
      Rating: [null, [Validators.required]],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    this.isSendingReqest = true;
    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost('teams/add', obj)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.dialogRef.close(data);
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
        this.isSendingReqest = false;
      });
  }

  close() {
    this.dialogRef.close();
  }

}


@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatButtonModule,
    TranslateModule,
    MatDialogModule
  ],
  declarations: [AddTeamComponent]
})
export class AddTeamModule {

}
