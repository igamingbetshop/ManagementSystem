import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";


import { MatButtonModule } from "@angular/material/button";
import { take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSelectModule } from '@angular/material/select';
import { SportsbookApiService } from '../../platforms/sportsbook/services/sportsbook-api.service';

@Component({
  selector: 'app-add-note',
  templateUrl: './sb-add-note.component.html',
  styleUrls: ['./sb-add-note.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
  ],
})


export class SbAddNoteComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  BetId: number;
  CommentTypes: any[] = [];
  allCommentTypes: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<SbAddNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { CommentTypes: any, BetId: any },
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.BetId = this.data.BetId;
    this.CommentTypes = this.data.CommentTypes;
    this.allCommentTypes = this.data.CommentTypes.filter((type) => {
      return type.Kind == 1;
    }).sort((a, b) => a.Id - b.Id);
    this.formValues();

    this.formGroup.get('TypeId').valueChanges.subscribe((value) => {
      this.onTypeIdChange(value);
    });
  }

  formValues() {
    this.formGroup = this.fb.group({
      TypeId: [null, [Validators.required]],
      Comment: [null],
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
    obj.BetId = this.BetId;
    this.apiService.apiPost('commenttypes/addbetcomment', obj)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.dialogRef.close(data);
        } else {
          this._snackBar.open(data.Description, 'Close', { duration: 3000, panelClass: 'snack-bar-error' });
        }
      });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  private onTypeIdChange(value: number) {
    const commentControl = this.formGroup.get('Comment');
    if (value === 7) {
      commentControl.setValidators([Validators.required]);
    } else {
      commentControl.clearValidators();
    }
    commentControl.updateValueAndValidity(); // Update validators
  }
}