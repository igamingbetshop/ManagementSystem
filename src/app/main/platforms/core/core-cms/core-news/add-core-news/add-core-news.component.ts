import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";


import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonDataService, ConfigService, LocalStorageService } from 'src/app/core/services';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { CoreApiService } from '../../../services/core-api.service';
import { Controllers, Methods } from 'src/app/core/enums';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import {ACTIVITY_STATUSES, NEWS_TYPES} from 'src/app/core/constantes/statuses';
import { compressImage } from 'src/app/core/utils';

@Component({
  selector: 'app-add-core-news',
  templateUrl: './add-core-news.component.html',
  styleUrls: ['./add-core-news.component.scss'],
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
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ],
})
export class AddCoreNewsComponent implements OnInit {
  partners: any[] = [];
  partnerId = null;
  formGroup: UntypedFormGroup;
  states = ACTIVITY_STATUSES;
  types = NEWS_TYPES;
  environments: any[] = [];
  isParent: boolean;
  isSendingReqest = false; 

  constructor(
    public dialogRef: MatDialogRef<AddCoreNewsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ParentId: number },
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    private localStorageService: LocalStorageService,
    public configService: ConfigService,
    public dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    this.isParent = !!this.data?.ParentId;
    this.createForm();
    this.partners = this.localStorageService.get('core_partners');
    this.getDate();
    setTimeout(() => {
      if (this.data?.ParentId) {
        this.formGroup.get('PartnerId').setValue(this.data?.ParentId);
        this.formGroup.get('PartnerId').disable();
        this.getPartnerEnvironments(this.data?.ParentId);
      }
    }, 0);
  }

  getDate() {
    let fromDay = new Date();
    fromDay.setHours(0);
    fromDay.setMinutes(0);
    fromDay.setSeconds(0);
    fromDay.setMilliseconds(0);

    let toDay = new Date();
    toDay.setHours(0);
    toDay.setMinutes(0);
    toDay.setSeconds(0);
    toDay.setMilliseconds(0);
    toDay.setDate(toDay.getDate() + 1);

    this.formGroup.get('StartDate').setValue(fromDay);
    this.formGroup.get('FinishDate').setValue(toDay);
  }

  getPartnerEnvironments(val) {
    if(!this.isParent)  {
      this.partnerId = +val;
    }
    this.apiService.apiPost(this.configService.getApiUrl, this.partnerId || this.data.ParentId,
      true, Controllers.PARTNER, Methods.GET_PARTNER_ENVIRONMENTS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.environments = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  uploadFile(event) {
    let files = event.target.files.length && event.target.files[0];
    if (files) {
      const validDocumentSize = files.size < 5000000;
      const validDocumentFormat = /(\.jpg|\.jpeg|\.png|\.gif)$/.test(event.target.value);
      if (validDocumentFormat && validDocumentSize)
      {
        const reader = new FileReader();
        reader.onload = () => {
          const binaryString = reader.result as string;

          if(files.size < 700000)
          {
            this.formGroup.get('ImageData').setValue(binaryString.substring(binaryString.indexOf(',') + 1));
            this.formGroup.get('ImageName').setValue(files.name.substring(files.name.lastIndexOf(".") + 1));
          }
          else
          {
            const img = new Image();
            img.src = binaryString;
            img.onload = (data) => {
              compressImage(img, 0.7).toBlob( (blob) => {
                  if (blob)
                  {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () =>  {
                      const base64data = reader.result as string;
                      this.formGroup.get('ImageData').setValue(binaryString.substring(binaryString.indexOf(',') + 1));
                      this.formGroup.get('ImageName').setValue(files.name.substring(files.name.lastIndexOf(".") + 1));
                    }
                  }
                },
                files.type,
                0.7)
            }

          }
        };
        reader.readAsDataURL(files);
      } else {
        this.formGroup.get('Image').patchValue(null);
        files = null;
        SnackBarHelper.show(this._snackBar, {Description : 'Not valid format jpg, png, or Gif and size < 700KB', Type : "error"});
      }
    }
  }


  uploadFile1(evt) {
    let files = evt.target.files;
    let file = files[0];
    if (files && file) {
      let reader = new FileReader();
      reader.onload = () => {
        const binaryString = reader.result as string;
        this.formGroup.get('ImageDataSmall').setValue(binaryString.substr(binaryString.indexOf(',') + 1));
      };
      reader.readAsDataURL(file);
    }
  }

  uploadFile2(evt) {
    let files = evt.target.files;
    let file = files[0];
    if (files && file) {
      let reader = new FileReader();
      reader.onload = () => {
        const binaryString = reader.result as string;
        this.formGroup.get('ImageDataMedium').setValue(binaryString.substr(binaryString.indexOf(',') + 1));
      };
      reader.readAsDataURL(file);
    }
  }


  public createForm() {
    this.formGroup = this.fb.group({
      PartnerId: [null, [Validators.required]],
      ParentId: [this.data?.ParentId || null],
      EnvironmentTypeId: [null, [Validators.required]],
      StartDate: [null],
      FinishDate: [null],
      NickName: [null, [Validators.required]],
      ImageName: [null],
      State: [null, [Validators.required]],
      ImageData: [null],
      Type: [null,  [Validators.required]],
      ImageDataSmall: [""],
      ImageDataMedium: [null],
      Order: [null, [Validators.required]],
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
      SnackBarHelper.show(this._snackBar, { Description: 'Choose Image Data', Type: "error" });
      return;
    }
    const obj = this.formGroup.getRawValue();
    this.isSendingReqest = true;
    this.apiService.apiPost(this.configService.getApiUrl, obj,
      true, Controllers.CONTENT, Methods.SAVE_NEWS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
        this.dialogRef.close(obj);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      })


  }

}
