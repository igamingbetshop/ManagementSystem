import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Controllers, Methods } from 'src/app/core/enums';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { CoreApiService } from '../../../services/core-api.service';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { DateAdapter } from "@angular/material/core";
import { PromotionsService } from '../core-promotions.service';
import { ACTIVITY_STATUSES, DEVICE_TYPES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-core-promotion',
  templateUrl: './core-promotion.component.html',
  styleUrls: ['./core-promotion.component.scss']
})
export class CorePromotionComponent implements OnInit {

  partnerId = 0;
  id: number = 0;
  promotion;
  segments = [];
  environments: any[] = [];
  formGroup: UntypedFormGroup;
  SegmentType;
  LanguageType;
  Segments = [];
  LanguageNames = [];
  promotionTypes: any = [];
  languages: any = [];
  languageEntites = [];
  segmentesEntites = [];
  isEdit = false;
  states = ACTIVITY_STATUSES;
  image: any;
  imageMedium: any;
  imageSmall: any;
  startDates: any;
  finishDates: any;
  deviceTypes = DEVICE_TYPES;
  childe: any;

  constructor(
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    public configService: ConfigService,
    private promotionsService: PromotionsService,
    private fb: UntypedFormBuilder,
    private router: Router,
    public dateAdapter: DateAdapter<Date>,
    private commonDataService: CommonDataService,
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    this.createForm();
    this.getPromotionTypes();
    this.id = +this.activateRoute.snapshot.queryParams.Id;
    this.childe = this.activateRoute.snapshot.queryParams.Childe;
    this.languages = this.commonDataService.languages;
    this.getPromotionById();
    this.getDate();
  }

  getPromotionTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, this.partnerId,
      true, Controllers.ENUMERATION, Methods.GET_PROMOTION_TYPES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.promotionTypes = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getPromotionById() {
    this.apiService.apiPost(this.configService.getApiUrl, { Id: this.id }, true, Controllers.CONTENT, Methods.Get_Promotion_By_Id)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.promotion = data.ResponseObject;
          this.image = "https://" + this.promotion?.SiteUrl + '/assets/images/promotions/' + this.promotion?.ImageName;
          this.imageMedium = "https://" + this.promotion?.SiteUrl + '/assets/images/promotions/medium/' + this.promotion?.ImageName;
          this.imageSmall = "https://" + this.promotion?.SiteUrl + '/assets/images/promotions/small/' + this.promotion?.ImageName;
          this.promotion.StatusName = this.promotion.State === 1 ? 'Active' : this.promotion.State === 2 ? 'Inactive' : '';
          this.promotion.DeviceName = this.deviceTypes.find(x => x.Id === this.promotion.DeviceType)?.Name || 'All';
          this.promotion.TypeName = this.promotionTypes.find(x => x.Id === this.promotion.Type)?.Name;
          this.partnerId = this.promotion.PartnerId;
          this.formGroup.patchValue(this.promotion);
          this.startDates = this.promotion?.StartDate;
          this.finishDates = this.promotion?.FinishDate;
          this.formGroup.get('EnvironmentTypeId').setValue(1);
          this.getPartnerEnvironments();
          this.getSegments(this.partnerId);
          // TODO need to improving (delete unused variables)

          this.SegmentType = this.promotion?.Segments?.Type;
          this.LanguageType = this.promotion?.Languages?.Type;
          this.Segments = this.promotion?.Segments?.Ids;
          this.LanguageNames = this.promotion?.Languages?.Names;

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  getSegments(id) {
    this.apiService.apiPost(this.configService.getApiUrl, { PartnerId: id },
      true, Controllers.CONTENT, Methods.GET_SEGMENTS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.segments = data.ResponseObject;
          this.setSegmentsEntytes();
          this.setLanguageEntytes();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  getPartnerEnvironments() {
    this.apiService.apiPost(this.configService.getApiUrl, this.partnerId, true, Controllers.PARTNER, Methods.GET_PARTNER_ENVIRONMENTS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.environments = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  setSegmentsEntytes() {
    this.segmentesEntites.push(this.formGroup.value?.Segments?.Ids.map(elem => {
      return this.segments?.find((item) => elem === item?.Id)?.Name
    }))
  }

  setLanguageEntytes() {
    this.languageEntites.push(this.formGroup.value.Languages.Names.map(elem => {
      return this.languages.find((item) => elem === item.Id).Name
    }))

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

  public createForm() {
    this.formGroup = this.fb.group({
      EnvironmentTypeId: [null, [Validators.required]],
      StartDate: [null],
      FinishDate: [null],
      NickName: [null, [Validators.required]],
      ImageName: [null],
      Type: [null, [Validators.required]],
      State: [null, [Validators.required]],
      ImageData: [null],
      ImageDataSmall: [""],
      StyleType: [null],
      DeviceType: [null],
      ImageDataMedium: [null],
      Order: [null, [Validators.required]],
      Segments: this.fb.group({
        Ids: [null],
        Names: [null],
        Type: [null],
      }),
      Languages: this.fb.group({
        Ids: [null],
        Names: [null],
        Type: [null],
      }),


    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  uploadFile(evt) {
    let files = evt.target.files;
    let file = files[0];
    if (files && file) {
      let reader = new FileReader();
      reader.onload = () => {
        const binaryString = reader.result as string;
        this.formGroup.get('ImageData').setValue(binaryString.substr(binaryString.indexOf(',') + 1));
      };
      reader.readAsDataURL(file);
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

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const request = this.formGroup.getRawValue();
    request.PartnerId = this.partnerId;
    request.ParentId = this.promotion.ParentId;
    request.Id = this.id;
    if(request.DeviceType == -1) {
      request.DeviceType = null;
    }
    this.apiService.apiPost(this.configService.getApiUrl, request, true, Controllers.CONTENT, Methods.SAVE_PROMOTION)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.getPromotionById();
          this.isEdit = false;
          this.languageEntites = [];
          this.segmentesEntites = [];
          SnackBarHelper.show(this._snackBar, { Description: 'success', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  onNavigateToPromotions() {
    this.promotionsService.update(this.promotion);
    this.router.navigate(['/main/platform/cms/promotions'])
  }

}
