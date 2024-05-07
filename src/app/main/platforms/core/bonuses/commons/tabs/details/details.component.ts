import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { CoreApiService } from "../../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../../core/services";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Controllers, GridRowModelTypes, Methods, ModalSizes } from "../../../../../../../core/enums";
import { take } from "rxjs/operators";
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { AgGridAngular } from "ag-grid-angular";
import { DatePipe } from "@angular/common";
import { OpenerComponent } from "../../../../../../components/grid-common/opener/opener.component";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { DateAdapter } from "@angular/material/core";
import { BonusesService } from "../../../bonuses.service";
import { ACTIVITY_STATUSES, DAYS, REGULARITY } from 'src/app/core/constantes/statuses';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent extends BasePaginatedGridComponent implements OnInit {
  public commonId;
  public rowData = [];
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public columnDefs = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public formGroup: UntypedFormGroup;
  public isEdit = false;
  public enableEditIndex;
  public commonSettings;
  public partners;
  public languages;
  public countries;
  public countriesEntites = [];
  public languageEntites = [];
  public segmentesEntites = [];
  public segments;
  public currencies;
  public clientType: any[] = [];
  public bonusTypes = [];
  public validDocumentSize;
  public validDocumentFormat;
  public checkDocumentSize;
  public accountTypeId;
  public accounttypeName;
  public regularitys = REGULARITY;
  public days = DAYS;
  public status = ACTIVITY_STATUSES;
  public TypeConditions;

  public addedConditions = {
    selectedGroupType: 1,
    groupTypes: [
      { Id: 1, Name: 'All' },
      { Id: 2, Name: 'Any' }
    ],
    groups: [],
    conditions: [],
    selectedCondition: null,
    selectedConditionType: null,
    selectedConditionValue: null
  };

  public conditionTypes;
  public conditions = [];
  public bonusTypeId: number;

  constructor(
    private apiService: CoreApiService,
    private commonDataService: CommonDataService,
    private fb: UntypedFormBuilder,
    private activateRoute: ActivatedRoute,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    protected injector: Injector,
    public dialog: MatDialog,
    public dateAdapter: DateAdapter<Date>,
    private bonusesService: BonusesService) {
    super(injector);
    this.dateAdapter.setLocale('en-GB');
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Payments.Comment',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Comment',
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Common.ChangeDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ChangeDate',
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.ChangeDate, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Payments.CreatedBy',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusPrize',
        sortable: true,
        resizable: true,
        cellRenderer: params => {
          var a = document.createElement('div');
          if (params.data.FirstName !== null || params.data.LastName !== null) {
            a.innerHTML = params.data.FirstName + ' ' + params.data.LastName;
          }
          return a;
        },
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          data.path = this.router.url.split('?')[0] + '/' + params.data.Id;
          return data;
        },
        sortable: false
      }
    ];
  }

  ngOnInit() {
    this.getBounusTypes();
    this.getAllCountries();
    this.commonId = this.activateRoute.snapshot.queryParams.commonId;
    this.partners = this.commonDataService.partners;
    this.languages = this.commonDataService.languages;
    this.currencies = this.commonDataService.currencies;
    this.conditions = this.bonusesService.getConditions();
    this.getOperationFilters();
    this.getClientType();
    this.getObjectHistory();
    this.formValues();
  }

  getBounusTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.ENUMERATION, Methods.GET_BONUS_TYPES_ENUM)
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.bonusTypes = data.ResponseObject;
        }
      })
  }

  getClientType() {
    this.apiService
      .apiPost(this.configService.getApiUrl, {}, true, Controllers.ENUMERATION, Methods.GET_CLIENT_ACCOUNT_TYPES_ENUM)
      .subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.clientType = data.ResponseObject;
          this.getBonusInfo();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  getOperationFilters() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_FILTER_OPTIONS)
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.conditionTypes = data.ResponseObject;
        }
      })
  }

  setCommonSettings(data) {
    this.commonSettings = data;
    this.commonSettings.PartnerName = this.partners.find((item) => this.commonSettings.PartnerId === item.Id).Name;
    this.accountTypeId = this.commonSettings?.AccountTypeId;
    this.accounttypeName = this.clientType.find(type => type.Id == this.accountTypeId)?.Name;
    this.commonSettings['BonusTypeName'] = this.bonusTypes?.find(x => x.Id == this.commonSettings?.BonusTypeId)?.Name;
    this.bonusTypeId = this.commonSettings?.BonusTypeId;
    this.getPartnerPaymentSegments(this.commonSettings.PartnerId);
    this.formGroup.patchValue(this.commonSettings);

    this.TypeConditions = this.commonSettings.Conditions;
    if ((this.bonusTypeId === 12 || this.bonusTypeId === 13 || this.bonusTypeId === 10) && this.commonSettings?.Conditions ) {
      this.addedConditions = this.bonusesService?.getResponseConditions(this.commonSettings?.Conditions, this.conditionTypes);
    }

    if (this.bonusTypeId == 10) {
      this.conditions = this.conditions.filter(element => {
        return element.Id === 16
      })
    }

    this.countriesEntites.push(this.commonSettings?.Countries.Ids.map(elem => {
      return this.countries.find((item) => elem === item.Id).Name
    }))

  }

  getBonusInfo() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.commonId, true,
      Controllers.BONUS, Methods.GET_BONUS_INFO).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.setCommonSettings(data.ResponseObject);
        }
      });
  }

  formValues() {
    this.formGroup = this.fb.group({
      Id: [{ value: null, disabled: true }],
      Percent: [{ value: null, disabled: true }],
      AutoApproveMaxAmount: [null],
      CreationTime: [null],
      Info: [null],
      // Conditions: [null],
      LastExecutionTime: [null],
      LinkedBonusId: [null],
      LinkedCampaign: [null],
      Period: [{ value: null, disabled: true }],
      Priority: [null],
      PromoCode: [null],
      UpdateTime: [null],
      Status: [false],
      Name: [{ value: null, disabled: true }],
      ResetOnWithdraw: [false],
      AllowSplit: [false],
      RefundRollbacked: [false],
      PartnerId: [{ value: null, disabled: true }],
      PartnerName: [{ value: null, disabled: true }],
      AccountTypeId: [{ value: null, disabled: true }],
      MinAmount: [null],
      MaxAmount: [null],
      StartTime: [null],
      FinishTime: [null],
      // Products: [null],
      ValidForAwarding: [null],
      BonusTypeName: [{ value: null, disabled: true }],
      BonusTypeId: [{ value: null, disabled: true }],
      ValidForSpending: [null],
      Sequence: [{ value: null, disabled: true }],
      MaxGranted: [{ value: null, disabled: true }],
      TurnoverCount: [null],
      MaxReceiversCount: [{ value: null, disabled: true }],
      TotalGranted: [{ value: null, disabled: true }],
      TotalReceiversCount: [{ value: null, disabled: true }],
      ReusingMaxCount: [null],
      FreezeBonusBalance: [null],
      WinAccountTypeId: [null],
      Description: [null],
      Regularity: [null],
      DayOfWeek: [null],
      ReusingMaxCountInPeriod: [null],
      Countries: this.fb.group({
        Ids: [null],
        Names: [null],
        Type: [this.commonSettings?.Countries.Type],
      }),
      SegmentIds: this.fb.group({
        Ids: [null],
        Names: [null],
        Type: [this.commonSettings?.SegmentIds.Type],
      }),
      Languages: this.fb.group({
        Ids: [null],
        Names: [null],
        Type: [this.commonSettings?.Languages.Type],
      }),
      Currencies: this.fb.group({
        Ids: [null],
        Names: [null],
        Type: [this.commonSettings?.Currencies.Type],
      }),
      PaymentSystemIds: this.fb.group({
        Ids: [null],
        Names: [null],
        Type: [this.commonSettings?.PaymentSystemIds.Type],
      }),
      // Conditions: this.fb.group({
      //   Conditions: this.fb.group([
      //     this.fb.group({
      //       ConditionType: [null],
      //       OperationTypeId: [null],
      //       StringValue: []
      //     })
      //   ]),
      //   GroupingType: [null],
      // })
    })
  }

  addGroup(item) {
    item.groups.push({
      selectedGroupType: 1,
      groupTypes: [
        { Id: 1, Name: 'All' },
        { Id: 2, Name: 'Any' }
      ],
      groups: [],
      conditions: [],
      selectedCondition: null,
      selectedConditionType: null,
      selectedConditionValue: null
    });
  }

  addCondition(item) {
    item.conditions.push({
      ConditionType: item.selectedConditionType,
      Condition: item.selectedCondition,
      ConditionValue: item.selectedConditionValue
    });
    item.selectedConditionType = null;
    item.selectedCondition = null;
    item.selectedConditionValue = null;
  }

  removeCondition(item, index) {
    item.conditions.splice(index, 1);
  }

  removeGroup(item, index) {
    item.groups.splice(index, 1);
  }

  getObjectHistory() {
    this.apiService.apiPost(this.configService.getApiUrl, { ObjectId: this.commonId, ObjectTypeId: 65 }, true,
      Controllers.REPORT, Methods.GET_OBJECT_CHANGE_HISTORY).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
        }
      });
  }

  getAllCountries() {
    this.apiService.apiPost(this.configService.getApiUrl, { TypeId: 5 }, true,
      Controllers.REGION, Methods.GET_REGIONS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.countries = data.ResponseObject;
        }
      });
  }

  getPartnerPaymentSegments(partnerId) {
    this.apiService.apiPost(this.configService.getApiUrl, { PartnerId: partnerId }, true,
      Controllers.CONTENT, Methods.GET_SEGMENTS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.segments = data.ResponseObject;
          this.setSegmentsEntytes();
          this.setLanguageEntytes();
        }
      });
  }

  setSegmentsEntytes() {
    // Set Segments Names
    this.segmentesEntites.push(this.formGroup.value.SegmentIds.Ids.map(elem => {
      return this.segments.find((item) => elem === item.Id).Name
    }))
  }

  setLanguageEntytes() {
    this.languageEntites.push(this.formGroup.value.Languages.Names.map(elem => {
      return this.languages.find((item) => elem === item.Id).Name
    }))

  }

  uploadFile(event) {
    let files = event.target.files.length && event.target.files[0];
    if (files) {
      this.validDocumentSize = files.size < 900000;
      this.validDocumentFormat = files.type === 'image/png' ||
        files.type === 'image/jpg' || files.type === 'image/jpeg' || files.type === 'image/gif';
      if ((files.size < 900000) &&
        (files.type === 'image/png' || files.type === 'image/jpg' || files.type === 'image/jpeg' || files.type === 'image/gif')) {
        this.checkDocumentSize = true;
        const reader = new FileReader();
        reader.onload = () => {
          const binaryString = reader.result as string;
          this.formGroup.get('ImageData').setValue(binaryString.substr(binaryString.indexOf(',') + 1));
          this.formGroup.get('Name').setValue(files.name);
          if (files.name.lastIndexOf(".") > 0) {
            let fileExtension = files.name.substring(files.name.lastIndexOf(".") + 1, files.name.length);
            this.formGroup.get('Extension').setValue(fileExtension);
          }
        };
        reader.readAsDataURL(files);
      } else {
        this.checkDocumentSize = false;
        files = null;
        SnackBarHelper.show(this._snackBar, { Description: 'Failed', Type: "error" });
      }
    }
  }

  onSubmit() {
    const requestBody = this.formGroup.getRawValue();
    delete requestBody.PartnerName;
    requestBody.AccountTypeId = this.accountTypeId;
    requestBody.AmountSettings = this.commonSettings.AmountSettings;

    if (this.bonusTypeId === 12 || this.bonusTypeId === 13 || this.bonusTypeId === 10) {
      requestBody.Conditions = this.bonusesService.getRequestConditions(this.addedConditions);
    }
    this.apiService.apiPost(this.configService.getApiUrl, requestBody, true,
      Controllers.BONUS, Methods.UPDATE_BONUS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.countriesEntites = [];
          this.languageEntites = [];
          this.segmentesEntites = [];
          this.getObjectHistory()
          this.getBonusInfo();
          this.isEdit = false;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  async onOpenCurrencySettings() {
    const { AddCurrencySettingsComponent } = await import('../../../currency-settings/add-currency-settings/add-currency-settings.component');
    const dialogRef = this.dialog.open(AddCurrencySettingsComponent, { width: ModalSizes.MEDIUM, data: { isUpToAmmount: true } });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        const payload = { ...this.commonSettings }
        payload.AmountSettings.push(data);
        delete payload.Products;
        this.updateBounus(payload);
      }
    });
  }

  updateBounus(payload) {
    this.apiService.apiPost(this.configService.getApiUrl, payload, true,
      Controllers.BONUS, Methods.UPDATE_BONUS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.getBonusInfo();
          SnackBarHelper.show(this._snackBar, { Description: "Success", Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onAmmountSettingsChange(event) {
    const payload = { ...this.commonSettings, AmountSettings: event };
    delete payload.Products;
    this.updateBounus(payload);
  }

}
