import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { CoreApiService } from '../../../services/core-api.service';
import { Controllers, Methods } from 'src/app/core/enums';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { compressImage } from "../../../../../../core/utils";
import { DateTimePickerComponent } from 'src/app/main/components/data-time-picker/data-time-picker.component';

export const pagingSource = {
  types: [
    { Id: 1, Name: 'Home Page' },
    { Id: 3, Name: 'Casino' },
    { Id: 4, Name: 'Live Casino' },
    { Id: 5, Name: 'Skill Games' },
    { Id: 6, Name: 'Mobile Home Page' },
    // {Id: 7, Name: 'Mobile Virtual Games'},
    { Id: 8, Name: 'Mobile Casino' },
    { Id: 8, Name: 'Mobile Live Casino' },
    { Id: 9, Name: 'Mobile Skill Games' },
  ],
};

@Component({
  selector: 'app-add-core-banner',
  templateUrl: './add-core-banner.component.html',
  styleUrls: ['./add-core-banner.component.scss'],
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
    FormsModule,
    MatDialogModule,
    MatSnackBarModule,
    DateTimePickerComponent
  ],
})
export class AddCoreBannerComponent implements OnInit {

  partners: any[] = [];
  fragments: any[] = [];
  widgets: any[] = [];
  partnerId = null;
  formGroup: UntypedFormGroup;
  bannerTypes: any = {};
  bannerTypeId: number = 1;
  isSendingReqest = false;
  bannerVisibilityTypes: any[] = [];

  categorySource = {
    types: [],
    selectedType: { Id: '1', Name: 'Category 1' }
  };

  mainTypes = ['Page Specific', 'Category Specific', 'Fragmental'];
  selectedMainType = 'Page Specific';

  fragmentalSource: any = {};
  environments: any[] = [];
  selectedEnvironmentId = null;

  constructor(
    public dialogRef: MatDialogRef<AddCoreBannerComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private translate: TranslateService,
    public commonDataService: CommonDataService,
    public configService: ConfigService,
    public dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
    this.bannerVisibilityTypes = [
      { id: 1, name: this.translate.instant('Clients.LoggedOut') },
      { id: 2, name: this.translate.instant('Clients.LoggedIn') },
      { id: 3, name: this.translate.instant('Clients.NoDeposit') },
      { id: 4, name: this.translate.instant('Clients.OneDepositOnly') },
      { id: 5, name: this.translate.instant('Clients.TwoOrMoreDeposits') },
    ];
  }

  ngOnInit() {
    this.partners = this.commonDataService.partners;
    this.setBannerTypeSource('Page Specific');
    this.createForm();
    this.getDate();
    this.initCategorySource();
  }

  initCategorySource(): void {
    for (let i = 1; i < 100; i++) {
      const webId = i + 100;
      const mobileId = i + 200;
      this.categorySource.types.push({ Id: `${webId}`, Name: `Category ${i} Web` }, { Id: `${mobileId}`, Name: `Category ${i} Mobile` });
    }
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
    this.formGroup.get('EndDate').setValue(toDay);
  }

  setBannerTypeSource(val) {
    this.selectedMainType = val;
    if (this.selectedMainType === 'Page Specific') {
      this.bannerTypes = pagingSource;
    } else if (this.selectedMainType === 'Category Specific') {
      this.bannerTypes = this.categorySource;
    } else {
      this.getBannerFragments();
    }
  }

  getBannerFragments() {
    this.apiService.apiPost(this.configService.getApiUrl, this.partnerId,
      true, Controllers.CONTENT, Methods.GET_BANNER_FRAGMENTS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.fragmentalSource.types = data.ResponseObject;
          this.bannerTypes = this.fragmentalSource;

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getPartnerEnvironments(val) {
    if (val) {
      this.formGroup.get('EnvironmentTypeId').enable();
      this.formGroup.get('FragmentName').enable();
    } else {
      this.formGroup.get('EnvironmentTypeId').disable();
      this.formGroup.get('FragmentName').disable();
      return;
    }
    this.partnerId = +val
    this.apiService.apiPost(this.configService.getApiUrl, this.partnerId,
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
      if (validDocumentFormat && validDocumentSize) {
        const reader = new FileReader();
        reader.onload = () => {
          const binaryString = reader.result as string;

          if (files.size < 900000) {
            this.formGroup.get('ImageData').setValue(binaryString.substring(binaryString.indexOf(',') + 1));
            this.formGroup.get('Image').setValue(files.name.substring(files.name.lastIndexOf(".") + 1));
          }
          else {
            const img = new Image();
            img.src = binaryString;
            img.onload = (data) => {
              compressImage(img, 0.7).toBlob((blob) => {
                if (blob) {
                  const reader = new FileReader();
                  reader.readAsDataURL(blob);
                  reader.onloadend = () => {
                    const base64data = reader.result as string;
                    this.formGroup.get('ImageData').setValue(binaryString.substring(binaryString.indexOf(',') + 1));
                    this.formGroup.get('Image').setValue(files.name.substring(files.name.lastIndexOf(".") + 1));
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
        SnackBarHelper.show(this._snackBar, { Description: 'Not valid format jpg, png, or Gif and size < 700KB', Type: "error" });
      }
    }
  }

  public createForm() {
    this.formGroup = this.fb.group({
      PartnerId: [null, [Validators.required]],
      EnvironmentTypeId: [null, [Validators.required]],
      StartDate: [null],
      EndDate: [null],
      Order: [null, [Validators.required, Validators.pattern(/^[0-9]*[1-9]+$|^[1-9]+[0-9]*$/)]],
      Body: [null],
      NickName: [null, [Validators.required]],
      Head: [null],
      Link: [null],
      Image: [null, [Validators.required]],
      FragmentName: ['Page Specific', [Validators.required]],
      Type: [1],
      Visibility: [],
      ShowLogin: [false],
      ShowDescription: [false],
      IsEnabled: [false],
      ShowRegistration: [false],
      ImageData: [null, [Validators.required]],
    });
    this.formGroup.get('EnvironmentTypeId').disable();
    this.formGroup.get('FragmentName').disable();

  }

  get errorControl() {
    return this.formGroup.controls;

  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    const request = this.formGroup.getRawValue();
    this.isSendingReqest = true;
    if (this.bannerTypes.types.length == 0) {
      delete request.Type;
    }

    delete request.FragmentName;
    if (request.Visibility === "null") {
      request.Visibility = null;
    }

    this.apiService.apiPost(this.configService.getApiUrl, request,
      true, Controllers.CONTENT, Methods.SAVE_WEB_SITE_BANNER)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close('success');
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      });
  }
}
