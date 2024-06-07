import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { take } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'app-add-comment-type',
  templateUrl: './add-player-categories.component.html',
  styleUrls: ['./add-player-categories.component.scss'],
  standalone: true,
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
})
export class AddPlayerCategoriesComponent implements OnInit {

  public formGroup: UntypedFormGroup;
  public sports: any[] = [];
  isSendingReqest = false;

  constructor(
    public dialogRef: MatDialogRef<AddPlayerCategoriesComponent>,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
  ) { }

  ngOnInit() {

    this.createForm();
  }

  public createForm() {
    this.formGroup = this.fb.group({
      Id: [null, [Validators.required]],
      Name: [null, [Validators.required]],
      LimitPercent: [null, [Validators.required]],
      DelayPercentPrematch: [null, [Validators.required]],
      DelayPercentLive: [null, [Validators.required]],
      DelayBetweenBetsPrematch: [null, [Validators.required]],
      DelayBetweenBetsLive: [null, [Validators.required]],
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
    this.apiService.apiPost('players/addcategory', obj)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.dialogRef.close(data);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      });
  }

  close() {
    this.dialogRef.close();
  }

}