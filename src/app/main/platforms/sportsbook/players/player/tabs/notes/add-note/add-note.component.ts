import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { ConfigService } from 'src/app/core/services';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.scss'],
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
    MatSelectModule,
    MatButtonModule,
  ]
})
export class AddNoteComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  private objectId;
  public objectTypeId;
  notes = [];
  comments;
  isSendingReqest = false;

  constructor(
    public dialogRef: MatDialogRef<AddNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ObjectId: any, ObjectTypeId: any, CommentTypes: any },
    public configService: ConfigService,
    private apiService: SportsbookApiService, 
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.objectId = +this.data.ObjectId;
    this.objectTypeId = +this.data.ObjectTypeId;
    this.comments = this.data.CommentTypes;
    this.formValues();
  }

  onCommentTypeChange() {
    let typeId = this.formGroup.get('CommentTemplateId').value;
    if(typeId) {
      this.formGroup.get('Message').clearValidators();
      this.formGroup.get('Message').updateValueAndValidity();
      this.formGroup.get('Type').setValue(3);
      this.formGroup.get('Message').setValue('')
    }
  }


  formValues() {
    this.formGroup = this.fb.group({
      Id: [0],
      Message: [null, Validators.required],
      CommentTemplateId: [null],
      ObjectId: [this.objectId],
      ObjectTypeId: [this.objectTypeId],
      State: [1],
      Type: [1],
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    if (this.formGroup.invalid) {
      return;
    }
    this.isSendingReqest = true;
    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost('players/createnote', obj).pipe(take(1)).pipe(take(1)).subscribe((data) => {

      if (data.Code === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
      this.isSendingReqest = false;
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

}
