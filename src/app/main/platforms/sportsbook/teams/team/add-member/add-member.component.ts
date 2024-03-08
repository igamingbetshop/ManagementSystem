import {CommonModule} from '@angular/common';
import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {SportsbookApiService} from '../../../services/sportsbook-api.service';
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {take} from 'rxjs/operators';
import {MatInputModule} from '@angular/material/input';

import {MatButtonModule} from '@angular/material/button';

import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";
import {TranslateModule} from "@ngx-translate/core";
import {DialogModule} from "@angular/cdk/dialog";

@Component({
  selector: 'app-add-team',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss'],
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
    DialogModule,
    MatDialogModule
  ]
})
export class AddMemberComponent implements OnInit {

  public formGroup: UntypedFormGroup;
  private sportId:  number;
  private memberType = 1;
  private parentId: number;

  constructor(
    public dialogRef: MatDialogRef<AddMemberComponent>,
    private apiService: SportsbookApiService,
    @Inject(MAT_DIALOG_DATA) public data: { SportId: number, ParentId: number},
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
  ) {
  }

  ngOnInit() {
    this.sportId =  this.data.SportId;
    this.parentId = this.data.ParentId;
    this.createForm();
  }

  public createForm() {
    this.formGroup = this.fb.group({
      SportId: [this.sportId, [Validators.required]] ,
      TypeId: [this.memberType, [Validators.required]],
      Name: [null, [Validators.required]],
      Rating: [null, [Validators.required]],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  onSubmit() {
    let requestBody = this.formGroup.getRawValue();
    if (this.parentId){
        requestBody = {...requestBody, ParentId: this.parentId};
    }
    this.apiService.apiPost('teams/add', requestBody)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.dialogRef.close(data);
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }

  close() {
    this.dialogRef.close();
  }
}
