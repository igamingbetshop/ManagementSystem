import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";

import { take } from "rxjs/operators";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";


import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSelectModule } from '@angular/material/select';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';

import { SportsbookApiService } from '../../../../services/sportsbook-api.service';

@Component({
  standalone: true,
  selector: 'app-add-note',
  templateUrl: './delete-bet.component.html',
  styleUrls: ['./delete-bet.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule
  ],
})
export class DeleteBetComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  CommentTypes: any[] = [];
  allCommentTypes: any[] = [];

  message: string = '';
  path: string;
  betId: string | number

  constructor(
    public dialogRef: MatDialogRef<DeleteBetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { CommentTypes: any, Message: string, Path: string, BetId: string | number },
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.CommentTypes = this.data.CommentTypes;
    this.path = this.data.Path;
    this.getComentsType();
    this.message = this.data.Message;
    this.betId = this.data.BetId;
    this.formValues();
  }

  getComentsType() {
    this.allCommentTypes = this.data.CommentTypes.filter((type) => {
      return this.path == "deletebet" ? type.Kind == 2 : type.Kind == 3
    });
  }

  formValues() {
    this.formGroup = this.fb.group({
      Kind: [],
      Comment: [''],
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();

    let type = null;
    if (this.path == "deletebet") {
      type = obj.Kind;
    }

    this.apiService.apiPost(`report/${this.path}`,
      {
        BetIds: [this.betId],
        TypeId: type,
        Comment: obj.Comment
      })
      .pipe(take(1))
      .subscribe(res => {
        if (res.Code === 0) {
          this.dialogRef.close(obj);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: obj.Description, Type: "error" });
        }
      })
  }

  get errorControl() {
    return this.formGroup.controls;
  }

}
