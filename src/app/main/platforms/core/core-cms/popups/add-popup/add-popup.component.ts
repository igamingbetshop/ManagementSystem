import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
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
import { ACTIVITY_STATUSES } from 'src/app/core/constantes/statuses';
import { DateTimePickerComponent } from 'src/app/main/components/data-time-picker/data-time-picker.component';

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
    DateTimePickerComponent

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
  environments: any[] = [];
  selectedEnvironmentId = null;
  selectedImage = '';
  deviceTypes: any[];
  submitting: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AddPopupComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    @Inject(MAT_DIALOG_DATA) public data: { deviceTypes: any[] },
    public commonDataService: CommonDataService,
    public configService: ConfigService,
    public dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    this.partners = this.commonDataService.partners;
    this.deviceTypes = this.data.deviceTypes;
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
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
  
      const validDocumentSize = file.size < 5000000; 
      const validDocumentFormat = /\.(jpg|jpeg|png|gif)$/i.test(file.name);
  
      if (validDocumentFormat && validDocumentSize) {
        const reader = new FileReader();
  
        reader.onload = () => {
          const binaryString = reader.result as string;
  
          if (file.size < 900000) {
            this.formGroup.get('ImageData').setValue(binaryString.substring(binaryString.indexOf(',') + 1));
            this.formGroup.get('ImageName').setValue(file.name.substring(file.name.lastIndexOf(".") + 1));
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
                    this.formGroup.get('ImageData').setValue(base64data.substring(base64data.indexOf(',') + 1));
                    this.formGroup.get('ImageName').setValue(file.name.substring(file.name.lastIndexOf(".") + 1));
                  };
                }
              }, file.type, 0.7);
            };
          }
        };
  
        reader.readAsDataURL(file);
      } else {
        this.formGroup.get('ImageData').setValue(null);
        this.formGroup.get('ImageName').setValue(null);

        SnackBarHelper.show(this._snackBar, { Description: 'Invalid format or size. Please use jpg, jpeg, png, or gif files under 5MB.', Type: "error" });
      }
    }
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
      ImageData: [null, [Validators.required]],
      Order: [null, [Validators.required, Validators.pattern(/^[0-9]*[1-9]+$|^[1-9]+[0-9]*$/)]],
      Page: [null],
      StartDate: [null, [Validators.required]],
      FinishDate: [null, [Validators.required]],
      SegmentIds: [null],
      ClientIds: [null, [this.clientIdsValidator()]],
      DeviceType: [null],
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
    if (this.formGroup.invalid || this.submitting) {
      return;
    }
  
    this.submitting = true;
  
    const request = this.formGroup.getRawValue();
    
    if (request.ClientIds != null) {
      request.ClientIds = request.ClientIds.split(',').map(Number);
    }
  
    this.apiService.apiPost(
      this.configService.getApiUrl,
      request,
      true,
      Controllers.CONTENT,
      Methods.SAVE_POPUP
    )
    .pipe(take(1))
    .subscribe(
      (data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close('success');
        } else {
          SnackBarHelper.show(this._snackBar, {
            Description: data.Description,
            Type: 'error'
          });
        }
      },
      (error) => {
        console.error('Error submitting form:', error);
        SnackBarHelper.show(this._snackBar, {
          Description: 'An error occurred while processing your request.',
          Type: 'error'
        });
      }
    )
    .add(() => {
      this.submitting = false;
    });
  }
}
