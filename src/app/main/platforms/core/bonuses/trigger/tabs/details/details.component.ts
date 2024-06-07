import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Controllers, GridRowModelTypes, Methods, ModalSizes } from "../../../../../../../core/enums";
import { take } from "rxjs/operators";
import { CoreApiService } from "../../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../../core/services";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { OpenerComponent } from "../../../../../../components/grid-common/opener/opener.component";
import { DatePipe } from "@angular/common";
import { AgGridAngular } from "ag-grid-angular";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { DateAdapter } from "@angular/material/core";
import { BonusesService } from "../../../bonuses.service";
import { ACTIVITY_STATUSES, DAYS } from 'src/app/core/constantes/statuses';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public triggerId;
  public triggerSettings;
  public triggerSetting;
  public rowData;
  public columnDefs = [];
  public paymentEntites = [];
  public paymentSystems;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public formGroup: UntypedFormGroup;
  public isEdit = false;
  public enableEditIndex;
  public partners;
  public days = DAYS;
  public statuses = ACTIVITY_STATUSES;
  public sources = [
    { Id: 1, Name: 'BetAmount' },
    { Id: 2, Name: 'WinAmount' }
  ];
  public triggerType: number;
  public conditionTypes;

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

  public conditions = [];

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
    this.triggerId = this.activateRoute.snapshot.queryParams.triggerId;
    this.partners = this.commonDataService.partners;
    this.conditions = this.bonusesService.getConditions();
    this.getPaymentSystems();
    this.getOperationFilters();
    this.getObjectHistory();
    this.formValues();
    this.getTriggerSettings();
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

  getPaymentSystems() {
    this.apiService.apiPost(this.configService.getApiUrl, {IsActive: true},
      true, Controllers.PAYMENT, Methods.GET_PAYMENT_SYSTEMS)
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.paymentSystems = data.ResponseObject;
        }
      })
  }

  getTriggerSettings() {
    this.apiService.apiPost(this.configService.getApiUrl, { Id: this.triggerId }, true,
      Controllers.BONUS, Methods.GET_TRIGGER_SETTINGS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.setTriggerSettings(data.ResponseObject);
        }
      });
  }

  setTriggerSettings(data) {
    this.triggerSettings = data.Entities.map((trigger) => {
      trigger.PartnerName = this.partners.find((item) => trigger.PartnerId === item.Id).Name;
      trigger.StatusName = this.statuses.find((item) => trigger?.Status == item.Id).Name;
      if (trigger.DayOfWeek) {
        trigger.Day = this.days.find((item) => trigger?.DayOfWeek === item.Id).Name;
      }
      trigger.Status
      return trigger;
    });
    this.triggerSetting = this.triggerSettings[0];
    this.triggerType = this.triggerSetting.Type;

    this.formGroup.patchValue(this.triggerSetting)

    
    // if (this.triggerSetting?.PaymentSystemIds) {
    //   this.formGroup.get('PaymentSystemIds').setValue(this.triggerSetting?.PaymentSystemIds);
    // }
    // this.formGroup.get('BonusSettingCodes').setValue(this.triggerSetting?.BonusSettingCodes);
    // if (this.triggerType === 7) {
    //   this.formGroup.get('Sequence').setValue(this.triggerSetting?.Sequence);
    // } else if (this.triggerType === 7 || this.triggerType === 8) {
    //   this.formGroup.get('UpToAmount').setValue(this.triggerSetting?.UpToAmount);
    // }
    if (this.triggerType === 1 || this.triggerType === 2 || this.triggerType === 3) {
      this.addedConditions = this.bonusesService.getResponseConditions(this.triggerSetting?.Conditions, this.conditionTypes);
    }

    this.setPaymentSystems();
  }

  private formValues() {
    this.formGroup = this.fb.group({
      Id: [null],
      Percent: [null],
      PartnerId: [null],
      Name: [null],
      Amount: [null],
      Description: [null],
      DayOfWeek: [null],
      Status: [null],
      TranslationId: [null],
      MinAmount: [null],
      Type: [null],
      MaxAmount: [null],
      Sequence: [null],
      StartTime: [null],
      FinishTime: [null],
      SegmentId: [null],
      MinBetCount: [null],
      UpToAmount: [null],
      BonusSettingCodes: [null],
      ConsiderBonusBets: [null],
      PaymentSystemIds: this.fb.group({
        Ids: [null],
        Names: [null],
        Type: [this.triggerSetting?.PaymentSystemIds.Type || 1],
      }),
    })
  }

  getObjectHistory() {
    this.apiService.apiPost(this.configService.getApiUrl, { ObjectId: this.triggerId, ObjectTypeId: 72 }, true,
      Controllers.REPORT, Methods.GET_OBJECT_CHANGE_HISTORY).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
        }
      });
  }

  public cancel() {
    this.formGroup.reset();
  }

  get errorControls() {
    return this.formGroup.controls;
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

  getSourceName(sourceId: number) {
    return this.sources.find(source => source.Id === sourceId)?.Name;
  }

  submit() {
    const trigger = this.formGroup.getRawValue();

    if (this.triggerType === 1 || this.triggerType === 2 || this.triggerType === 3) {
      trigger.Conditions = this.bonusesService.getRequestConditions(this.addedConditions);
    }

    if(trigger.Type === 12 ) {
      trigger.MinAmount = trigger.Amount;
      delete trigger.Amount;
    }
    
    this.apiService.apiPost(this.configService.getApiUrl, trigger, true,
      Controllers.BONUS, Methods.SAVE_TRIGGER_SETTING).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.isEdit = false;
          this.paymentEntites = [];
          this.getTriggerSettings();
          this.getObjectHistory();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  setPaymentSystems() {
    if (this.formGroup.value.PaymentSystemIds.Ids) {
      this.paymentEntites.push(this.formGroup.value.PaymentSystemIds?.Ids.map(elem => {
        return this.paymentSystems?.find((item) => elem === item.Id).Name
      }))
    }

  }

  onAmmountSettingsChange(event) {
    const payload = { ...this.triggerSetting, AmountSettings: event };
    delete payload.Products;
    this.saveTriggerSettings(payload);
  }


  async onOpenCurrencySettings() {
    const { AddCurrencySettingsComponent } = await import('../../../currency-settings/add-currency-settings/add-currency-settings.component');
    const dialogRef = this.dialog.open(AddCurrencySettingsComponent, { width: ModalSizes.MEDIUM });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        const payload = { ...this.triggerSetting }
        payload.AmountSettings.push(data);
        delete payload.Products;
        this.saveTriggerSettings(payload);
      }
    });
  }

  saveTriggerSettings(payload) {
    this.apiService.apiPost(this.configService.getApiUrl, payload, true,
      Controllers.BONUS, Methods.SAVE_TRIGGER_SETTING).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.getTriggerSettings();
          SnackBarHelper.show(this._snackBar, { Description: "Success", Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

}
