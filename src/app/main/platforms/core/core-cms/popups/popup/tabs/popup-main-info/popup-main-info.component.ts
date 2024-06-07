import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { DateAdapter } from "@angular/material/core";

import { Controllers, Methods, ModalSizes } from 'src/app/core/enums';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { ACTIVITY_STATUSES } from 'src/app/core/constantes/statuses';
import { compressImage } from 'src/app/core/utils';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { CoreApiService } from '../../../../../services/core-api.service';
import { PopupService } from '../../../popup.service';

@Component({
  selector: 'app-popup-main-info',
  templateUrl: './popup-main-info.component.html',
  styleUrls: ['./popup-main-info.component.scss']
})

export class PopupMainInfoComponent implements OnInit {
  partners: any[] = [];
  partnerId = null;
  id: number = 0;
  popup;
  segments: any[] = [];
  environments: any[] = [];
  formGroup: UntypedFormGroup;
  SegmentType;
  SegmentIds = [];
  LanguageNames = [];
  LanguageType;
  languages: any = [];
  isEdit = false;
  segmentesEntites = [];
  image: any;
  types: any;
  states = ACTIVITY_STATUSES;
  deviceTypes = [];

  constructor(
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    private activateRoute: ActivatedRoute,
    public configService: ConfigService,
    private fb: UntypedFormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private popupService: PopupService,
    public dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    this.createForm();
    this.getDeviceTypes();
    this.getPopupTypes();
    this.partners = this.commonDataService.partners;
    this.id = +this.activateRoute.snapshot.queryParams.id;
    this.languages = this.commonDataService.languages;
    this.getPopupById();
  }

  setSegmentsEntytes() {
    this.segmentesEntites.push(this.popup.SegmentIds?.map(elem => {
      return this.segments.find((item) => elem === item.Id).Name
    }))
  }

  getDeviceTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_DEVICE_TYPES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.deviceTypes = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
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


  getPopupById() {
    this.apiService.apiPost(this.configService.getApiUrl, this.id,
      true, Controllers.CONTENT, Methods.GET_POPUP_BY_ID)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.popup = data.ResponseObject;
         this.segments.length === 0 ? this.getPartnerPaymentSegments(this.popup.partnerId): this.setPopup();
        }
      })
  }

  setPopup() {
    this.partnerId = this.popup?.PartnerId;
    this.popup.PartnerName = this.partners.find((item) => this.partnerId === item.Id).Name;
    this.popup.TypeName = this.types?.find((item) => this.popup.Type === item.Id).Name;
    this.popup.StateName = this.states?.find((item) => this.popup.State === item.Id).Name;
    this.popup.DeviceName = this.deviceTypes?.find(x => x.Id === this.popup.DeviceType)?.Name;
    this.image = "https://" + this.popup?.SiteUrl + '/assets/images/popup/web/' + this.popup?.ImageName;
    this.formGroup.patchValue(this.popup);
    this.getPartnerEnvironments();
    this.formGroup.get('EnvironmentTypeId').setValue(1);
    this.setSegmentsEntytes();
  }

  getPartnerPaymentSegments(partnerId) {
    if (this.segments.length === 0) {
      this.apiService.apiPost(this.configService.getApiUrl, { PartnerId: partnerId }, true,
        Controllers.CONTENT, Methods.GET_SEGMENTS).pipe(take(1)).subscribe(data => {
          if (data.ResponseCode === 0) {
            this.segments = data.ResponseObject;
            this.setPopup();
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        });
    }
  }

  getPartnerEnvironments() {
    if (this.environments.length === 0) {
      this.apiService.apiPost(this.configService.getApiUrl, this.partnerId,
        true, Controllers.PARTNER, Methods.GET_PARTNER_ENVIRONMENTS)
        .pipe(take(1))
        .subscribe(data => {
          if (data.ResponseCode === 0) {
            this.environments = data.ResponseObject;
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        })
    }
  }


  public createForm() {
    this.formGroup = this.fb.group({
      ClientIds: [null, Validators.pattern(/^(\d+,)*\d+$/)],
      EnvironmentTypeId: [null, [Validators.required]],
      FinishDate: [null, [Validators.required]],
      Id: [null],
      ImageData: [null],
      ImageName: [null],
      LastUpdateTime: [null, [Validators.required]],
      NickName: [null, [Validators.required, Validators.pattern(/^[a-z][a-z0-9]*$/i)]],
      Order: [null, [Validators.required, Validators.pattern(/^[0-9]*[1-9]+$|^[1-9]+[0-9]*$/)]],
      Page: [null],
      PartnerId: [null, [Validators.required]],
      SegmentIds: [null],
      StartDate: [null, [Validators.required]],
      State: [null, [Validators.required]],
      TranslationId: [null],
      CreationTime: [null, [Validators.required]],
      Type: [null, [Validators.required]],
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
    return this.formGroup?.controls;
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

  convertToArray(controlName: string): void {
    const values = this.formGroup.get(controlName).value
      .split(',')
      .map(value => parseFloat(value.trim()))
      .filter(value => !isNaN(value));

    this.formGroup.get(controlName).setValue(values);
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    obj.PartnerId = this.partnerId;
    obj.Id = String(this.id);

    this.apiService.apiPost(this.configService.getApiUrl, obj,
      true, Controllers.CONTENT, Methods.SAVE_POPUP)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.isEdit = false;
          this.segmentesEntites = [];
          this.getPopupById();

          SnackBarHelper.show(this._snackBar, { Description: 'Success', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }


  onCancel() {
    this.isEdit = false;
    this.segmentesEntites = [];
    this.setPopup();
  }

  onNavigateToPopups() {
    this.router.navigate(['/main/platform/cms/popups'])
    this.popupService.update(this.popup);
  }

  async onUploadDescription() {
    const id = this.popup.Id;
    const { AddEditTranslationComponent } = await import('../../../../../../../components/add-edit-translation/add-edit-translation.component');
    const dialogRef = this.dialog.open(AddEditTranslationComponent, {
      width: ModalSizes.MEDIUM, data: {
        ObjectId: id,
        ObjectTypeId: 100,
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        SnackBarHelper.show(this._snackBar, { Description: `Succsess`, Type: "success" });
      }
    })
  }

}
