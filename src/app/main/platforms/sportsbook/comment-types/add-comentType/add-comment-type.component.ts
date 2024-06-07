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
  templateUrl: './add-comment-type.component.html',
  styleUrls: ['./add-comment-type.component.scss'],
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
export class AddCommentTypeComponent implements OnInit {

  formGroup: UntypedFormGroup;
  sports: any[] = [
    { Id: 1, Name: 'Bet Comment' },
    { Id: 2, Name: 'Delete Reason' },
    { Id: 3, Name: 'Reject Reason' }
  ];
  isSendingReqest = false;

  constructor(
    public dialogRef: MatDialogRef<AddCommentTypeComponent>,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  public createForm() {
    this.formGroup = this.fb.group({
      Kind: [null, [Validators.required]],
      Name: [null, [Validators.required]],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost('commenttypes/add', obj)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          data.Color = "#000000"; // temporary solution - backend will be  implemented Color field
          this.dialogRef.close(data);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  close() {
    this.dialogRef.close();
  }

}