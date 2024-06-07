import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SportsbookApiService } from '../../../services/sportsbook-api.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { compressImage } from "../../../../../../core/utils";
import { DateTimePickerComponent } from 'src/app/main/components/data-time-picker/data-time-picker.component';

@Component({
  selector: 'app-add-banner',
  templateUrl: './add-banner.component.html',
  styleUrls: ['./add-banner.component.scss'],
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
    TranslateModule,
    MatDialogModule,
    DateTimePickerComponent
  ],
})
export class AddBannerComponent implements OnInit {

  sports: any[] = [];
  partners: any[] = [];
  fragments: any[] = [];
  widgets: any[] = [];
  partnerId = null;
  formGroup: UntypedFormGroup;
  bannerTypes = [
    { id: 1, name: 'Fragmental' },
    { id: 2, name: 'Widget' },
    { id: 4, name: 'SportSpecificWeb' },
    { id: 5, name: 'SportSpecificMobile' }
  ];
  bannerTypeId: number = 1;
  isSendingReqest = false;
  bannerVisibilityTypes = [
    { id: 'null', name: 'Always' },
    { id: 1, name: 'Logged Out' },
    { id: 2, name: 'Logged In' },
    { id: 3, name: 'No Deposit' },
    { id: 4, name: 'One Deposit Only' },
    { id: 5, name: 'Two Or More Deposits' }
  ];

  constructor(
    public dialogRef: MatDialogRef<AddBannerComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: SportsbookApiService,
    public dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    this.apiService.apiPost('sports').subscribe(data => {
      if (data.Code === 0) {
        this.sports = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
    this.getPartners();
    this.getSports();
    this.createForm();
    this.getDate();
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

  getPartners() {
    this.apiService.apiPost('partners').subscribe(data => {
      if (data.Code === 0) {
        this.partners = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  getSports() {
    this.apiService.apiPost('sports').subscribe(data => {
      if (data.Code === 0) {
        this.sports = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  onPartnerChange(val) {
    this.fragments = [];
    this.widgets = [];
    if (val) {
      this.apiService.apiPost('cms/bannerfragments', { PartnerId: val }).subscribe(data => {
        if (data.Code === 0) {

          data.ResponseObject.forEach(item => {
            if (item.Type == 1)
              this.fragments.push(item);
            else
              this.widgets.push(item);
          });

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
      this.formGroup.get('FragmentName').enable();
      this.formGroup.get('Type').enable();
    } else if (val == null) {
      this.formGroup.get('FragmentName').disable();
      this.formGroup.get('Type').disable();
    }
    this.partnerId = val;

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

  onBannerTypeChange(val) {
    this.bannerTypeId = val;
  }


  public createForm() {
    this.formGroup = this.fb.group({
      PartnerId: [null, [Validators.required]],
      StartDate: [null],
      EndDate: [null],
      Order: [null, [Validators.required, Validators.pattern(/^[0-9]*[1-9]+$|^[1-9]+[0-9]*$/)]],
      Body: [null],
      NickName: [null, [Validators.required, Validators.pattern(/^[a-z][a-z0-9]*$/i)]],
      Head: [null],
      MatchId: [null],
      Link: [null],
      Image: [null, [Validators.required]],
      FragmentName: [null, [Validators.required]],
      SportId: [null],
      Type: [null],
      Visibility: ["null"],
      MarketTypeId: [null],
      ShowLogin: [false],
      ShowDescription: [false],
      IsEnabled: [true],
      ImageData: [null, [Validators.required]],
    });
    this.formGroup.get('FragmentName').disable();
    this.formGroup.get('Type').disable();
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
    this.isSendingReqest = true;
    const requestBody = this.formGroup.getRawValue();

    if (this.bannerTypeId == 4 || this.bannerTypeId == 5) {
      requestBody.Type = this.bannerTypeId;
    }

    if (this.bannerTypeId == 1 || this.bannerTypeId == 2) {
      delete requestBody.SportId;
    }

    delete requestBody.FragmentName;
    if (requestBody.Visibility === "null") {
      requestBody.Visibility = null;
    }

    this.saveBanner(requestBody);
  }

  saveBanner(request) {

    this.apiService.apiPost('cms/savebanner', request).pipe(take(1)).subscribe(data => {
      if (data.Code === 0) {
        this.dialogRef.close('success');
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
      this.isSendingReqest = false;
    });
  }
}
