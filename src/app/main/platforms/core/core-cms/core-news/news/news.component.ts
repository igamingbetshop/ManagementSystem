import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {take} from 'rxjs/operators';
import {Controllers, Methods} from 'src/app/core/enums';
import {CommonDataService, ConfigService} from 'src/app/core/services';
import {CoreApiService} from '../../../services/core-api.service';
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";
import {DateAdapter} from "@angular/material/core";
import { NewsService } from '../news.service';
import { ACTIVITY_STATUSES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  partnerId = 0;
  id: number = 0;
  news;
  segments = [];
  environments: any[] = [];
  formGroup: UntypedFormGroup;
  SegmentType;
  LanguageType;
  Segments = [];
  LanguageNames = [];
  languages: any = [];
  languageEntites = [];
  segmentesEntites = [];
  isEdit = false;
  states = ACTIVITY_STATUSES;
  types = [
    {Id: 0, Name: 'Sport'},
    {Id: 1, Name: 'Casino'},
    {Id: 2, Name: 'Live Casino'},
    {Id: 3, Name: 'Virtual Games'},
    {Id: 4, Name: 'Skill Games'},
  ]
  image: any;
  imageMedium: any;
  imageSmall: any;
  isChilde: boolean;

  constructor(
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    public configService: ConfigService,
    public newsService: NewsService,
    public router: Router,
    private fb: UntypedFormBuilder,
    public dateAdapter: DateAdapter<Date>,
    private commonDataService: CommonDataService,
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    this.createForm();
    this.id = +this.activateRoute.snapshot.queryParams.Id;
    this.isChilde = this.activateRoute.snapshot.queryParams.Childe;
    this.languages = this.commonDataService.languages;
    console.log(this.languages, 'languages');
    
    this.getNewsById();
    this.getDate();
  }

  getNewsById() {
    this.apiService.apiPost(this.configService.getApiUrl, {Id: this.id}, true, Controllers.CONTENT, Methods.GET_NEWS_BY_ID)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.news = data.ResponseObject;

          this.image = "https://" + this.news?.SiteUrl + '/assets/images/news/' + this.news?.ImageName;

          this.imageMedium = "https://" + this.news?.SiteUrl + '/assets/images/news/medium/' + this.news?.ImageName;

          this.imageSmall = "https://" + this.news?.SiteUrl + '/assets/images/news/small/' + this.news?.ImageName;

          this.news.StatusName = this.news.State === 1 ? 'Active' : this.news.State === 2 ? 'Inactive' : '';
          this.news.TypeName = this.news.Type === 0 ? 'Sport' : this.news.Type === 1 ? 'Casino' : this.news.Type === 2 ? 'Live Casino' : this.news.Type === 3 ? 'Virtual Games': this.news.Type === 4 ? 'Skill Games' : '';
          this.partnerId = this.news.PartnerId;
          this.formGroup.patchValue(this.news);
          this.formGroup.get('EnvironmentTypeId').setValue(1);
          this.getPartnerEnvironments();
          this.getSegments(this.partnerId);
          // TODO need to improving (delete unused variables)

          this.SegmentType = this.news?.Segments?.Type;
          this.LanguageType = this.news?.Languages?.Type;
          this.Segments = this.news?.Segments?.Ids;
          this.LanguageNames = this.news?.Languages?.Names;

        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      })
  }

  getSegments(id) {
    this.apiService.apiPost(this.configService.getApiUrl, {PartnerId: id},
      true, Controllers.CONTENT, Methods.GET_SEGMENTS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.segments = data.ResponseObject;
          this.setSegmentsEntytes();
          this.setLanguageEntytes();
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
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
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
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
      ImageName: [null, [Validators.required]],
      State: [null, [Validators.required]],
      ImageData: [null],
      ImageDataSmall: [""],
      StyleType: [null],
      ImageDataMedium: [null],
      Type: [null],
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
    request.ParentId = this.news.ParentId;
    request.Id = this.id;
    // request.Segments = {Ids: this.Segments, Type: +this.SegmentType};
    // request.Languages = {Type: +this.LanguageType, Names: this.LanguageNames};
    this.apiService.apiPost(this.configService.getApiUrl, request, true, Controllers.CONTENT, Methods.SAVE_NEWS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.getNewsById();
          this.isEdit = false;
          this.languageEntites = [];
          this.segmentesEntites = [];
          SnackBarHelper.show(this._snackBar, {Description: 'success', Type: "success"});
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      })
  }

  onNavigateToNews() {
    this.newsService.update(this.news);
    this.router.navigate(['/main/platform/cms/news']);
  }

}
