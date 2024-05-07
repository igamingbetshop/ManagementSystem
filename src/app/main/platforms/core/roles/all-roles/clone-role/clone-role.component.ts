import { CommonModule } from '@angular/common';
import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from "@ngx-translate/core";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { CoreApiService } from '../../../services/core-api.service';
import { ConfigService } from 'src/app/core/services';
import { Controllers, Methods } from 'src/app/core/enums';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";


@Component({
  selector: 'app-clone-role',
  templateUrl: './clone-role.component.html',
  styleUrls: ['./clone-role.component.scss'],
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
    MatDialogModule
  ]
})
export class CloneRoleComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  public role = {
    RoleId: null,
    NewRoleName: null,
    FromRoleName: null,
  }


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { Data: {} },
    public dialogRef: MatDialogRef<CloneRoleComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private configService: ConfigService,
  ) { }

  ngOnInit() {
    this.role.RoleId = this.data.Data['Id'];
    this.role.FromRoleName = this.data.Data['Name'];

    this.createForm();

  }

  public createForm() {
    this.formGroup = this.fb.group({
      NewRoleName: [null, [Validators.required]],
    });
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
    const obj = this.formGroup.getRawValue();
    this.role.NewRoleName = obj['NewRoleName'];
    this.apiService.apiPost(this.configService.getApiUrl, this.role,
      true, Controllers.PERMISSION, Methods.CLONE_ROLE)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })

  }

}

