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
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { BannerService } from '../core-banners.service';
import { pagingSource } from '../add-core-banner/add-core-banner.component';

@Component({
  selector: 'app-core-banner',
  templateUrl: './core-banner.component.html',
  styleUrls: ['./core-banner.component.scss']
})
export class CoreBannerComponent implements OnInit {
  partners: any[] = [];
  partnerId = null;
  id: number = 0;
  banner;
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
  languageEntites = [];
  visibilityEntites = []
  image: any;
  bannerVisibilityTypes = [
    { id: 1, name: 'Logged Out' },
    { id: 2, name: 'Logged In' },
    { id: 3, name: 'No Deposit' },
    { id: 4, name: 'One Deposit Only' },
    { id: 5, name: 'Two Or More Deposits' }
  ];
  // bannerTypes: any = {};
  selectedMainType = 1 as number;
  mainTypes = [
    { Id: 1, Name: 'Page Specific' },
    { Id: 2, Name: 'Category Specific' },
    { Id: 3, Name: 'Fragmental' }
  ]

  fragmentalSource: any = {};
  bannerTypes: any = { 1: pagingSource.types };

  categorySource = {
    types: [],
    selectedType: { Id: '1', Name: 'Category 1' }
  };

  sizes = [
    { id: null, name: 'No Size', selected: false },
    { id: '320-480', name: '320-480', selected: false },
    { id: '480-768', name: '480-768', selected: false },
    { id: '768-1024', name: '768-1024', selected: false },
    { id: '1024-1200', name: '1024-1200', selected: false },
    { id: '1200-1920', name: '1200-1920', selected: false },
  ];
  startDates: any;
  endDates: any;

  constructor(
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private bannerService: BannerService,
    public commonDataService: CommonDataService,
    private activateRoute: ActivatedRoute,
    public router: Router,
    public configService: ConfigService,
    private fb: UntypedFormBuilder,
    public dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    this.createForm();
    this.partners = this.commonDataService.partners;
    this.id = +this.activateRoute.snapshot.queryParams.Id;
    this.languages = this.commonDataService.languages;
    this.getBannerById();
    this.startDate();
    this.initCategorySource();

    setTimeout(() => {
      this.getPartnerEnvironments();
    }, 500);
  }

  setSegmentsEntytes() {
    this.segmentesEntites.push(this.formGroup.value.Segments.Ids.map(elem => {
      return this.segments.find((item) => elem === item.Id).Name
    }))
  }

  initCategorySource(): void {
    const types = []
    for (let i = 1; i < 100; i++) {
      const webId = i + 100;
      const mobileId = i + 200;
      types.push({ Id: `${+webId}`, Name: `Category ${i} Web` }, { Id: `${+mobileId}`, Name: `Category ${i} Mobile` });
    }
    this.bannerTypes[2] = types;
  }

  setLanguageEntytes() {
    this.languageEntites.push(this.formGroup.value.Languages.Names.map(elem => {
      return this.languages.find((item) => elem === item.Id).Name
    }))

  }

  setVisibilityEntytes() {
    this.visibilityEntites.push(this.formGroup.value.Visibility.map(elem => {
      return this.bannerVisibilityTypes.find((item) => elem === item.id).name
    }))

  }


  comparer(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.Id === o2.Id : o2 === o2;
  }

  getBannerById() {
    this.apiService.apiPost(this.configService.getApiUrl, { Id: this.id },
      true, Controllers.CONTENT, Methods.GET_BANNER_BY_ID)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.banner = data.ResponseObject;
          this.setBanner();
          this.getBannerFragments();
        }
      })
  }

  setBanner() {
    this.partnerId = this.banner?.PartnerId;
    this.startDates = this.banner?.StartDate;
    this.endDates = this.banner?.EndDate;
    this.image = "https://" + this.banner?.SiteUrl + '/assets/images/b/' + this.banner?.Image;
    this.formGroup.patchValue(this.banner);
    this.LanguageType = this.banner?.Languages?.Type;
    this.LanguageNames = this.banner?.Languages?.Names;
    this.SegmentType = this.banner?.Segments?.Type;
    this.SegmentIds = this.banner?.Segments?.Ids;
    this.checkSelectedSizes();
    this.getSegments();
    this.formGroup.get('EnvironmentTypeId').setValue(1)
  }
  updateStartDate(event: any) {
    this.startDate = event;
  }

  getSegments() {
    this.languageEntites = [];
    this.segmentesEntites = [];
    this.visibilityEntites = [];
    if (this.segments.length === 0) {
      this.apiService.apiPost(this.configService.getApiUrl, { PartnerId: this.partnerId },
        true, Controllers.CONTENT, Methods.GET_SEGMENTS)
        .pipe(take(1))
        .subscribe(data => {
          if (data.ResponseCode === 0) {
            this.segments = data.ResponseObject;
            this.setSegmentsEntytes();
            this.setLanguageEntytes();
            this.setVisibilityEntytes();
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        })
    } else {
      this.setSegmentsEntytes();
      this.setLanguageEntytes();
      this.setVisibilityEntytes();
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

  startDate() {
    DateTimeHelper.startDate();
    const fromDate = DateTimeHelper.getFromDate();
    const toDate = DateTimeHelper.getToDate();
    this.formGroup.get('StartDate').setValue(fromDate);
    this.formGroup.get('EndDate').setValue(toDate);
  }

  public createForm() {
    this.formGroup = this.fb.group({
      EnvironmentTypeId: [null, [Validators.required]],
      StartDate: [null],
      EndDate: [null],
      Order: [null, [Validators.required, Validators.pattern(/^[0-9]*[1-9]+$|^[1-9]+[0-9]*$/)]],
      Body: [null],
      NickName: [null, [Validators.required]],
      Head: [null],
      Link: [null],
      Image: [null, [Validators.required]],
      Type: [null],
      Visibility: [null],
      ShowLogin: [false],
      ShowDescription: [false],
      IsEnabled: [false],
      ShowRegistration: [false],
      ImageData: [null],
      ImageSize: [null],
      Segments: this.fb.group({
        Ids: [null],
        Names: [null],
        Type: [this.banner?.Segments.Type],
      }),
      Languages: this.fb.group({
        Ids: [null],
        Names: [null],
        Type: [this.banner?.Languages.Type],
      }),
    });
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
          this.formGroup?.get('Image').setValue(files.name.substring(files.name.lastIndexOf(".") + 1));
        };
        reader.readAsDataURL(files);
      } else {
        this.formGroup?.get('Image').patchValue(null);
        files = null;
        SnackBarHelper.show(this._snackBar, { Description: 'Not valid format jpg, png, or Gif and size < 700KB', Type: "error" });
      }
    }
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    obj.PartnerId = this.partnerId;
    obj.Id = String(this.id);

    if (obj.Visibility === 0) {
      obj.Visibility = null;
    }
    this.apiService.apiPost(this.configService.getApiUrl, obj,
      true, Controllers.CONTENT, Methods.SAVE_WEB_SITE_BANNER)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.isEdit = false;
          this.banner = data.ResponseObject;
          this.banner.TypeName = this.getTypeName(this.banner.Type);
          SnackBarHelper.show(this._snackBar, { Description: 'Success', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  private checkSelectedSizes() {
    this.sizes.forEach(size => {
      const availableSize = this.banner.ImageSizes.find(curSize => curSize === size.id)
      size.selected = !!availableSize;
    });
  }

  getBannerFragments() {
    this.apiService.apiPost(this.configService.getApiUrl, this.banner.PartnerId,
      true, Controllers.CONTENT, Methods.GET_BANNER_FRAGMENTS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.bannerTypes[3] = data.ResponseObject;
          this.banner.TypeName = this.getTypeName(this.banner.Type);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getTypeName(type: number): string {
    let typeName = '';
    if (type <= 3) {
      typeName = this.findNameById(this.bannerTypes["1"], type);
      this.selectedMainType = 1;
    } else if (type >= 101 && type <= 199) {
      typeName = this.findNameById(this.bannerTypes["2"], String(type));
      this.selectedMainType = 2;
    } else {
      typeName = this.findNameById(this.bannerTypes["3"], type);
      this.selectedMainType = 3;
    }

    return typeName;
  }

  private findNameById(dataArray: any[], id: any): string {
    const item = dataArray.find(item => String(item.Id) === String(id));
    return item ? item.Name : '';
  }

  onNavigateToBanners() {
    this.bannerService.update(this.banner);
    this.router.navigate(['/main/platform/cms/banners']);
  }

  setBannerTypeSource(ev) {
    this.selectedMainType = ev;
  }


  onCancel() {
    this.isEdit = false;
    this.setBanner();
  }


}
