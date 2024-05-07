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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { Controllers, Methods } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { ConfigService } from 'src/app/core/services';
import { CoreApiService } from 'src/app/main/platforms/core/services/core-api.service';
import { NumbersOnlyDirective } from 'src/app/core/directives/numbers-only.directive';
@Component({
  selector: 'app-application-setup',
  templateUrl: './application-setup.component.html',
  styleUrls: ['./application-setup.component.scss'],
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
    NumbersOnlyDirective
  ],
  providers: [
    CoreApiService
  ]
})
export class ApplicationSetupComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  userName;
  qrData;
  qrCodeImageSrc;
  _qrCodeWidth = 170;
  _qrCodeHeight = 161;


  constructor(
    public dialogRef: MatDialogRef<ApplicationSetupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { UserName: any, },
    public configService: ConfigService,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.userName = this.data.UserName;
    this.featchQRCode();
    this.formValues();
  }

  featchQRCode() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.USER, Methods.GENERATE_QR_CODE).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.qrData = data.ResponseObject;
          this.qrCodeImageSrc = `https://quickchart.io/qr?text=${this.qrData.Data}`
          this.formGroup.get('QRCode').setValue(this.qrData.Key);
        }
      });
  }

  formValues() {
    this.formGroup = this.fb.group({
      QRCode: [null],
      Pin: [null, [
        Validators.required,
        Validators.minLength(6)
      ]],
    });
  }

  close() {
    this.dialogRef.close();
  }

  onChangeQR() {
    this.qrCodeImageSrc = null;
    this.qrData = null;
    this.featchQRCode();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost(this.configService.getApiUrl, obj, true, Controllers.USER,
      Methods.ENABLE_TWO_FACTOR).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close("true");
          SnackBarHelper.show(this._snackBar, { Description: "Enabled",Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

}
