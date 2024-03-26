import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from "@ngx-translate/core";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";


import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';

import { CoreApiService } from '../../../services/core-api.service';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { compressImage } from 'src/app/core/utils';
import { Controllers, Methods } from 'src/app/core/enums';
import { ACTIVITY_STATUSES, ENVIRONMENTS_STATUSES } from 'src/app/core/constantes/statuses';


@Component({
  selector: 'app-add-gamification',
  templateUrl: './add-gamification.component.html',
  styleUrls: ['./add-gamification.component.scss'],
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
  ],
})
export class AddGamificationComponent implements OnInit {
  formGroup: UntypedFormGroup;
  partners: any[] = [];
  statuses: any[] = ACTIVITY_STATUSES;
  environments: any[] = ENVIRONMENTS_STATUSES;
  submitting = false;
  showCompPoints = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { paretnId: any, partnerId: any, order: boolean, compPoint: boolean },
    public dialogRef: MatDialogRef<AddGamificationComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private configService: ConfigService,
    public commonDataService: CommonDataService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.partners = this.commonDataService.partners;
    if (!!this.data.paretnId) {
      this.formGroup.get('PartnerId').setValue(this.data.partnerId);
      this.formGroup.get('PartnerId').disable();
      this.formGroup.addControl('BackgroundImageData',new FormControl('', [Validators.required]));
    } else {
      this.showCompPoints = false;
      this.formGroup.get('CompPoints').setValue(0);
      this.formGroup.get('CompPoints').disable();
      this.formGroup.addControl('Order', new FormControl('', [Validators.required]));
    }
  }

  public createForm() {
    this.formGroup = this.fb.group({
      NickName: [null, [Validators.required]],
      Description: [null, [Validators.required]],
      EnvironmentTypeId: [null, [Validators.required]],
      Title: [null, [Validators.required]],
      PartnerId: [null, [Validators.required]],
      Status: [null, [Validators.required]],
      CompPoints: [null, [Validators.required]],
      ImageExtension: [null, [Validators.required]],
      ImageData: [null, [Validators.required]],
      BackgroundImageData: [null],
      MobileBackgroundImageData: [null]
    });
  }

  handleFileUpload(files: File, imageControlName: string) {
    const validDocumentSize = files.size < 2500000;
    const validDocumentFormat = /(\.jpg|\.jpeg|\.png|\.gif)$/.test(files.name);

    if (validDocumentFormat && validDocumentSize) {
      const reader = new FileReader();
      reader.onload = () => {
        const binaryString = reader.result as string;
        if (files.size < 900000) {
          this.formGroup.get(imageControlName).setValue(binaryString.substring(binaryString.indexOf(',') + 1));
          if (imageControlName === 'ImageData') {
            this.formGroup.get('ImageExtension').setValue(files.name.substring(files.name.lastIndexOf(".") + 1));
          }
        } else {
          const img = new Image();
          img.src = binaryString;
          img.onload = () => {
            compressImage(img, 0.7).toBlob((blob) => {
              if (blob) {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                  const base64data = reader.result as string;
                  this.formGroup.get(imageControlName).setValue(binaryString.substring(binaryString.indexOf(',') + 1));
                }
              }
            }, files.type, 0.7)
          }
        }
      };
      reader.readAsDataURL(files);
    } else {
      this.formGroup.get(imageControlName).patchValue(null);
      SnackBarHelper.show(this._snackBar, { Description: 'Not a valid format (jpg, jpeg, png, or gif) or size exceeds 2.5MB', Type: "error" });
    }
  }

  uploadFile(event) {
    const files = event.target.files.length && event.target.files[0];
    if (files) {
      this.handleFileUpload(files, 'ImageData');
    }
  }

  uploadBackgroundImage(event) {
    const files = event.target.files.length && event.target.files[0];
    if (files) {
      this.handleFileUpload(files, 'BackgroundImageData');
    }
  }

  uploadMobileImage(event) {
    const files = event.target.files.length && event.target.files[0];
    if (files) {
      this.handleFileUpload(files, 'MobileBackgroundImageData');
    }
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formGroup.invalid || this.submitting) {
      return;
    }

    this.submitting = true;

    const obj = this.formGroup.getRawValue();
    if (!!this.data) {
      obj.ParentId = this.data.paretnId;
    }

    this.apiService.apiPost(this.configService.getApiUrl, obj, true, Controllers.PARTNER, Methods.SAVE_CHARACHTER)
      .pipe(take(1))
      .subscribe(data => {
        this.submitting = false;

        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: "Success", Type: "success" });
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }
}
