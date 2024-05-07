import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl,ValidatorFn, FormGroup, } from "@angular/forms";
import { Router } from '@angular/router';

import { TranslateModule } from "@ngx-translate/core";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService, ConfigService, LocalStorageService } from 'src/app/core/services';
import { Controllers, Methods } from 'src/app/core/enums';
import { CoreApiService } from 'src/app/main/platforms/core/services/core-api.service';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';

export default class Validation {
  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);
      if (checkControl.errors && !checkControl.errors.matching) {
        return null;
      }
      if (control.value !== checkControl.value) {
        controls.get(checkControlName).setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }
}

@Component({
  standalone: true,
  selector: 'app-add-note',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
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
    MatCardModule,
    MatSnackBarModule
  ],
  providers: [
    CoreApiService
  ]
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  formGroup: UntypedFormGroup;
  ignoreAutofill = true;
  errorMessage: string;
  imagePath: string = '';
  isSuccess = false;
  isSendingReqest = false;
  passwordsMatching = false;
  isConfirmPasswordDirty = false;

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router,
    private apiService: CoreApiService,
    public localStorageService: LocalStorageService,
    public configService: ConfigService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private _snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {

    this.formGroup = this.fb.group(
      {
        OldPassword: ['', [Validators.required]],
        NewPassword: [
          '',
          [
            Validators.required,
            Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$')
          ]
        ],
        CunfirmPassword: ['', Validators.required],
      },
      {
        validators: [Validation.match('NewPassword', 'CunfirmPassword')],
      },
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formGroup.controls;
  }

  onSubmit() {
    const request = this.formGroup.getRawValue();
    delete request.CunfirmPassword;
    this.isSendingReqest = true;
    this.apiService.apiPost(this.configService.getApiUrl, request, true,
      Controllers.USER, Methods.CHANGE_PASSWORD).pipe().subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.isSuccess = true;
          this.dialogRef.close();
          this.router.navigate(['/']);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      });
  }

  close() {
    this.dialogRef.close();
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  ngOnDestroy(): void {
    if (!this.isSuccess) {
      this.authService.logOut();
    }
  }

}
