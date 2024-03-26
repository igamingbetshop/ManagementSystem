import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { DateAdapter } from "@angular/material/core";

import { Controllers, Methods } from 'src/app/core/enums';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { CoreApiService } from '../../../services/core-api.service';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})

export class PopupComponent implements OnInit {
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
  mobileImage: string;

  constructor(
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    private activateRoute: ActivatedRoute,
    public configService: ConfigService,
    private fb: UntypedFormBuilder,
    public dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    this.createForm();
    this.getPopupTypes();
    this.partners = this.commonDataService.partners;
    this.id = +this.activateRoute.snapshot.queryParams.id;
    this.languages = this.commonDataService.languages;
    this.getPopupById();
  }

  setSegmentsEntytes() {
    this.segmentesEntites.push(this.formGroup.value.SegmentIds.map(elem => {
      return this.segments.find((item) => elem === item.Id).Name
    }))
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
          this.setPopup();
        }
      })
  }

  setPopup() {
    this.partnerId = this.popup?.PartnerId;
    this.popup.PartnerName = this.partners.find((item) => this.partnerId === item.Id).Name;
    this.popup.TypeName = this.types.find((item) => this.popup.Type === item.Id).Name;
    this.image = "https://" + this.popup?.SiteUrl + '/assets/images/popup/web/' + this.popup?.ImageName;
    this.mobileImage = "https://" + this.popup?.SiteUrl + '/assets/images/popup/mobile/' + this.popup?.ImageName;
    this.formGroup.patchValue(this.popup);
    this.getPartnerEnvironments();
    this.getPartnerPaymentSegments(this.partnerId);
    this.formGroup.get('EnvironmentTypeId').setValue(1);
  }

  getPartnerPaymentSegments(partnerId) {
    if (this.segments.length === 0) {
    this.apiService.apiPost(this.configService.getApiUrl, { PartnerId: partnerId }, true,
      Controllers.CONTENT, Methods.GET_SEGMENTS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.segments = data.ResponseObject;
          this.setSegmentsEntytes();
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
      ClientIds: [null, ],
      EnvironmentTypeId: [null, [Validators.required]],
      FinishDate: [null, [Validators.required]],
      Id: [null],
      ImageData: [null],
      ImageName: [null],
      MobileImageData: [null],
      LastUpdateTime: [null, [Validators.required]],
      NickName: [null, [Validators.required, Validators.pattern(/^[a-z][a-z0-9]*$/i)]],
      Order: [null, [Validators.required, Validators.pattern(/^[0-9]*[1-9]+$|^[1-9]+[0-9]*$/)]],
      Page: [null],
      PartnerId: [null, [Validators.required]],
      SegmentIds: [null, [Validators.required]],
      StartDate: [null, [Validators.required]],
      State: [null, [Validators.required]],
      TranslationId: [null],
      CreationTime: [null, [Validators.required]],
      Type: [null, [Validators.required]],
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
    let files = event.target.files.length && event.target.files[0];
    if (files) {
      const validDocumentSize = files.size < 900000;
      const validDocumentFormat = /(\.jpg|\.jpeg|\.png|\.gif)$/.test(event.target.value);
      if (validDocumentFormat && validDocumentSize) {
        const reader = new FileReader();
        reader.onload = () => {
          const binaryString = reader.result as string;
          this.formGroup?.get('ImageData').setValue(binaryString.substring(binaryString.indexOf(',') + 1));
          this.formGroup?.get('ImageName').setValue(files.name.substring(files.name.lastIndexOf(".") + 1));
        };
        reader.readAsDataURL(files);
      } else {
        this.formGroup?.get('ImageName').patchValue(null);
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
  
    let reader = new FileReader();
    reader.onload = () => {
      const binaryString = reader.result as string;
      this.formGroup.get('MobileImageData').setValue(binaryString.substr(binaryString.indexOf(',') + 1));
    };
    reader.readAsDataURL(file);
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
    // this.setPopup();
  }


}
