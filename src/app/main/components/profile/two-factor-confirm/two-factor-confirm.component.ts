import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { take } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { Controllers, Methods } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { ApiService, ConfigService } from 'src/app/core/services';
import { CoreApiService } from 'src/app/main/platforms/core/services/core-api.service';
import { NumbersOnlyDirective } from 'src/app/core/directives/numbers-only.directive';
@Component({
  selector: 'app-two-factor-confirm',
  templateUrl: './two-factor-confirm.component.html',
  styleUrls: ['./two-factor-confirm.component.scss'],
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
    MatProgressSpinnerModule,
    MatSnackBarModule,
    NumbersOnlyDirective
  ],
  providers: [
    CoreApiService
  ]
})
export class TwoFactorConfirm implements OnInit {
  public formGroup: UntypedFormGroup;
  public id = null;
  public isDisable: boolean;

  constructor(
    public dialogRef: MatDialogRef<TwoFactorConfirm>,
    public configService: ConfigService,
    public apiService: ApiService,
    private coreApiService: CoreApiService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data: {
      isDisable: boolean;
      id: any;
    },
    private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.formValues();
    if (this.data.id) {
      this.id = this.data.id;
      this.formGroup.get('UserId').setValue(this.id);
    }
    this.isDisable = this.data.isDisable;
  }

  formValues() {
    this.formGroup = this.fb.group({
      UserId: [null],
      Pin: [null, [
        Validators.required,
        Validators.minLength(6)
      ]],
    });
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    const payload = this.formGroup.getRawValue();
    if (this.formGroup.invalid) {
      return;
    }
    if (this.isDisable) {
      this.coreApiService.apiPost(this.configService.getApiUrl, payload, true, Controllers.USER,
        Methods.DISABLE_TWO_FACTOR).pipe(take(1)).subscribe((data) => {
          if (data.ResponseCode === 0) {
            this.dialogRef.close("true");
            SnackBarHelper.show(this._snackBar, { Description: `Succsess`, Type: "success" });
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
          }
        });
    } else {
      const url = this.configService.getApiUrl + '/' + "ValidateTwoFactorPIN";
      this.apiService.apiPost(url, { ...payload }).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close("true");
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      });
    }
  }

  get errorControl() {
    return this.formGroup.controls;
  }

}
