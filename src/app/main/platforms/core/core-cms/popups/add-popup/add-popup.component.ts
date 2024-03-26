import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
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
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from "@angular-material-components/datetime-picker";
import { compressImage } from "../../../../../../core/utils";
import { ACTIVITY_STATUSES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-add-popup',
  templateUrl: './add-popup.component.html',
  styleUrls: ['./add-popup.component.scss'],
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
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule
  ],
})
export class AddPopupComponent implements OnInit {

  partners: any[] = [];
  fragments: any[] = [];
  widgets: any[] = [];
  partnerId = null;
  formGroup: UntypedFormGroup;
  bannerTypes: any = {};
  bannerTypeId: number = 1;
  types: any[] = [];
  status = ACTIVITY_STATUSES;
  segments = [];

  fragmentalSource: any = {};
  environments: any[] = [];
  selectedEnvironmentId = null;
  selectedImage: "dasdasds";

  constructor(
    public dialogRef: MatDialogRef<AddPopupComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    public configService: ConfigService,
    public dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    this.partners = this.commonDataService.partners;
    this.createForm();
    this.getDate();
    this.getPopupTypes();
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

  getPopupTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_POPUP_TYPES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.types = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getBannerFragments() {
    this.apiService.apiPost(this.configService.getApiUrl, this.partnerId,
      true, Controllers.CONTENT, Methods.CET_BANNER_FRAGMENTS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.fragmentalSource.types = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getPartnerEnvironments(val) {
    this.partnerId = +val
    this.getPartnerPaymentSegments(this.partnerId);
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
            this.formGroup.get('ImageName').setValue(files.name.substring(files.name.lastIndexOf(".") + 1));
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
                    this.selectedImage = files.name;
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

  uploadFile1(evt) {
    let files = evt.target.files;
    if (!files || files.length === 0) {
      SnackBarHelper.show(this._snackBar,
        { Description: "Please choose a file", Type: "error" }
      );
      return;
    }
  
    let file = files[0];
    let fileName = file.name.split('.').pop();
    
    if (fileName != this.formGroup.get('ImageName').value) {
      SnackBarHelper.show(this._snackBar,
        { Description: "Chosen file format does not match the selected format", Type: "error" }
      );
      return;
    }
  
    let reader = new FileReader();
    reader.onload = () => {
      const binaryString = reader.result as string;
      this.formGroup.get('MobileImageData').setValue(binaryString.substr(binaryString.indexOf(',') + 1));
    };
    reader.readAsDataURL(file);
  }
  

  getPartnerPaymentSegments(partnerId) {
    this.apiService.apiPost(this.configService.getApiUrl, { PartnerId: partnerId }, true,
      Controllers.CONTENT, Methods.GET_SEGMENTS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.segments = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  public createForm() {
    this.formGroup = this.fb.group({
      PartnerId: [null, [Validators.required]],
      EnvironmentTypeId: [null, [Validators.required]],
      NickName: [null, [Validators.required, Validators.pattern(/^[a-z][a-z0-9]*$/i)]],
      Type: [null, [Validators.required]],
      State: [null, [Validators.required]],
      ImageName: [null, [Validators.required]],
      ImageData: [null],
      MobileImageData: [null],
      Order: [null, [Validators.required, Validators.pattern(/^[0-9]*[1-9]+$|^[1-9]+[0-9]*$/)]],
      Page: [null],
      StartDate: [null, [Validators.required]],
      FinishDate: [null, [Validators.required]],
      SegmentIds: [null],
      ClientIds: [null, [this.clientIdsValidator()]],
    });
  }

  clientIdsValidator() {
    return (control) => {
      const value = control.value;
      if (value) {
        const arrayOfNumbers = this.parseClientIds(value);
        if (arrayOfNumbers.length > 0) {
          return null;
        } else {
          return { invalidClientIds: true };
        }
      } else {
        return null;
      }
    };
  }

  parseClientIds(value: string): number[] {
    return value.split(',').map(Number);
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    const request = this.formGroup.getRawValue();

    if (request.ClientIds != null) {
      request.ClientIds = request.ClientIds.split(',').map(Number);
    }

    this.apiService.apiPost(this.configService.getApiUrl, request,
      true, Controllers.CONTENT, Methods.SAVE_POPUP)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close('success');
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }
}
