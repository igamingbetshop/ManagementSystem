import { Component, Injector, OnInit, signal, ViewChild } from '@angular/core';
import { DatePipe } from "@angular/common";
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { DateAdapter } from "@angular/material/core";
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from "rxjs/operators";
import { AgGridAngular } from "ag-grid-angular";

import { Controllers, GridRowModelTypes, Methods, ModalSizes } from "../../../../../../../core/enums";
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { CommonDataService, ConfigService } from "../../../../../../../core/services";
import { OpenerComponent } from "../../../../../../components/grid-common/opener/opener.component";
import { CoreApiService } from "../../../../services/core-api.service";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { BonusesService } from "../../../bonuses.service";
import { ACTIVITY_STATUSES, DAYS, REGULARITY } from 'src/app/core/constantes/statuses';
import { MatChipInputEvent } from '@angular/material/chips';
import { campaignTypes } from './campaing-types';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent extends BasePaginatedGridComponent implements OnInit {
  commonId;
  rowData = [];
  @ViewChild('agGrid') agGrid: AgGridAngular;
  columnDefs = [];
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  formGroup: UntypedFormGroup;
  isEdit = false;
  enableEditIndex;
  commonSettings;
  partners;
  languages;
  countries;
  countriesEntites = [];
  languageEntites = [];
  segmentesEntites = [];
  segments;
  currencies;
  clientType: any[] = [];
  bonusTypes = [];
  validDocumentSize;
  validDocumentFormat;
  checkDocumentSize;
  accountTypeId;
  accounttypeName;
  regularitys = REGULARITY;
  days = DAYS;
  status = ACTIVITY_STATUSES;
  TypeConditions;
  selectedCampaignIds: number[] = [];
  selectedCampaignsByType: { [key: number]: number[] } = {};
  allBounuses: any;
  tournamentData = signal([]);
  addedConditions = {
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
  color = '';
  // campaignControl: FormControl;
  // valueControl: FormControl;
  displayedColumns: string[] = [ 'Name', 'Order', 'Points'];

  conditionTypes;
  conditions = [];
  bonusTypeId: number;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  counts: any[] = [];
  campaigns = [];
  selectedType: number;
  campaignTypes = campaignTypes;

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
    // this.campaignControl = new FormControl('');
    // this.valueControl = new FormControl('');
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
    this.commonSettings.PartnerName = this.partners.find(item => this.commonSettings.PartnerId === item.Id).Name;
    this.accountTypeId = this.commonSettings?.AccountTypeId;
    this.accounttypeName = this.clientType.find(type => type.Id == this.accountTypeId)?.Name;
    this.commonSettings['BonusTypeName'] = this.bonusTypes?.find(x => x.Id == this.commonSettings?.BonusTypeId)?.Name;
    this.bonusTypeId = this.commonSettings?.BonusTypeId;
    this.color = this.commonSettings?.Color;
    this.getPartnerPaymentSegments(this.commonSettings.PartnerId);
    this.formGroup.patchValue(this.commonSettings);
    this.TypeConditions = this.commonSettings.Conditions;    
    if (this.bonusTypeId === 5) {
      this.counts = this.commonSettings.Info.split(", ").map(Number);
      const countsFormArray = this.fb.array(
        this.counts.map(count => this.fb.control(count, [Validators.required, Validators.pattern(/^\d+$/)])),
        { validators: this.validateChipSum }
      );
      this.formGroup.addControl('counts', countsFormArray);
      this.formGroup.get('counts').setValue(this.counts);
      this.fetchTournamentLeaderboard();
    } else if ((this.bonusTypeId === 12 || this.bonusTypeId === 13 || this.bonusTypeId === 10) && this.commonSettings?.Conditions) {
      this.addedConditions = this.bonusesService?.getResponseConditions(this.commonSettings?.Conditions, this.conditionTypes);
    } else if (this.bonusTypeId == 10) {
      this.conditions = this.conditions.filter(element => element.Id === 16);
    } else if (this.bonusTypeId == 4) {
      this.getBounuses();
      this.formGroup.setControl('Info', this.fb.array([]));
      this.formGroup.get('Info').setValidators([Validators.required, this.minSelectedItemsValidator(3)]);
      this.campaignTypes = [
        ...this.campaignTypes,
        { Name: "Sport.Wheel", Id: 4 },
      ]
      const infoControl = this.formGroup.get('Info') as FormArray;

      if (this.commonSettings.Info) {
          try {
              const parsedInfo = JSON.parse(this.commonSettings.Info);
              parsedInfo.forEach((item: any) => {
                  const newValue = {
                      BonusId: item.BonusId,
                      Periodicity: item.Periodicity
                  };
                  infoControl.push(this.fb.group(newValue));
              });
          } catch (error) {
              console.error("Error parsing Info:", error);
          }
      }

      this.formGroup.get('Info').updateValueAndValidity();
    } else {
      this.formGroup.get('Info').clearValidators();
      this.formGroup.get('Info').updateValueAndValidity();
    }

    this.countriesEntites.push(this.commonSettings?.Countries.Ids.map(elem => {
      return this.countries.find(item => elem === item.Id).Name;
    }));
  }

  minSelectedItemsValidator(min: number) {
    return (formArray: FormArray) => {
      return formArray.controls.length >= min ? null : { minSelectedItems: true };
    };
  }

  getBounuses() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.BONUS, Methods.GET_BONUSES)
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.allBounuses = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  fetchTournamentLeaderboard() {
    this.apiService.apiPost(this.configService.getApiUrl, 
      { BonusId: this.commonSettings.Id, LanguageId: "en"}, true,
      Controllers.BONUS, Methods.GET_TOURNAMENT_LEADERBOUARD).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.tournamentData.set(data.ResponseObject);
        }
      }
    );
  }

  getBonusInfo() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.commonId, true,
      Controllers.BONUS, Methods.GET_BONUS_INFO).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.setCommonSettings(data.ResponseObject);
        }
      });
  }

  get infoArray() {
    return this.formGroup.get('Info') as FormArray;
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
      Color: [null],
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
      FinalAccountTypeId: [null],
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
    } else if (this.bonusTypeId == 5) {
      requestBody.Info = requestBody.counts.join(', ');
      delete requestBody.counts;
    } else if(this.bonusTypeId == 4) {
      requestBody.Info = JSON.stringify(requestBody.Info);
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

  private normalizeDateTime(dateTime: string | null): string {
    if (!dateTime) return '';
  
    const date = new Date(dateTime);
    return date.toISOString().slice(0, 16); 
  }
  
  private convertToUtc(dateTime: string | null): string {
    if (!dateTime) return '';
  
    const date = new Date(dateTime);
    const utcHours = date.getUTCHours().toString().padStart(2, '0');
    const utcMinutes = date.getUTCMinutes().toString().padStart(2, '0');
    const utcDate = date.toISOString().slice(0, 10); // 'YYYY-MM-DD'
  
    return `${utcDate}T${utcHours}:${utcMinutes}`;
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


  get countsArray() {
    return this.formGroup.get('counts') as FormArray;
  }

  add(event: MatChipInputEvent): void {
    const input = event.chipInput!.inputElement;
    const value = (event.value || '').trim();
    if (value && !isNaN(Number(value))) {
      this.countsArray.push(this.fb.control(Number(value), [Validators.required, Validators.pattern(/^\d+$/)]));
    }

    if (input) {
      input.value = '';
    }

    this.countsArray.updateValueAndValidity();
  }

  remove(count: number): void {
    const index = this.countsArray.controls.findIndex(control => control.value == count);
    if (index >= 0) {
      this.countsArray.removeAt(index);
    }
    this.countsArray.updateValueAndValidity();
  }

  validateChipSum(formArray: FormArray) {
    const sum = formArray.controls.reduce((acc, control) => acc + Number(control.value), 0);
    return sum === 100 ? null : { sumNotEqual100: true };
  }


  fetchCampaigns(type: number) {
    let obj = {
          PartnerId: this.formGroup.get('PartnerId').value,
          Status: 1,
          Type: type || null
        }
        this.apiService.apiPost(this.configService.getApiUrl, obj, true, Controllers.BONUS,
          Methods.GET_BONUSES).pipe(take(1)).subscribe((data) => {
          if (data.ResponseCode === 0) {
            const newCampaigns = data.ResponseObject;
            this.campaigns = newCampaigns;        
            if( this.selectedCampaignIds.length > 0) {
              this.formGroup.get('Info').setValue(this.selectedCampaignIds);
            }
          } else {
            SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
          }
        });
  }


  addValue(campaign, value) {

    if (campaign && value !== null && value !== undefined) {
      if (value > 10) {
        SnackBarHelper.show(this._snackBar, { Description: "Value must be between 1 and 10.", Type: "error" });
        return;
      }
  
      const newValue = {
        BonusId: campaign,
        Periodicity: value
      };
  
      if (this.infoArray.length < 15) {
        this.infoArray.push(this.fb.group(newValue));
      } else {
        // Remove the first element (oldest value) to maintain a maximum of 15 elements
        this.infoArray.removeAt(0);
        this.infoArray.push(this.fb.group(newValue));
      }
  
      // this.campaignControl.reset();
      // this.valueControl.reset();
  
      this.infoArray.updateValueAndValidity();
    } else {
      SnackBarHelper.show(this._snackBar, { Description: "Please select a campaign and enter a valid value.", Type: "error" });
    }
  }


  onTypeChange(type: number) {
    this.selectedType = type;
    this.fetchCampaigns(type);
  }
  
  onCampaignChange(selectedCampaignIds: number[]) {
    this.selectedCampaignsByType[this.selectedType] = selectedCampaignIds;
    const allSelectedCampaignIds = Object.values(this.selectedCampaignsByType).flat();
  }
  
  handleValueAdded(newValue: any) {
    this.addValue(newValue.BonusId, newValue.Periodicity);
  }

  removeValue(index: number) {
    this.infoArray.removeAt(index);
    this.infoArray.updateValueAndValidity();
  }

}
