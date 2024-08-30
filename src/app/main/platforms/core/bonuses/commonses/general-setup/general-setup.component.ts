import { Component, Inject, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CoreApiService } from "../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../core/services";
import { FormArray, FormControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Controllers, Methods } from "../../../../../../core/enums";
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { DateAdapter } from "@angular/material/core";
import { take } from "rxjs/operators";
import { BonusesService } from "../../bonuses.service";
import { ACTIVITY_STATUSES, DAYS, REGULARITY } from 'src/app/core/constantes/statuses';
import { MatChipInputEvent } from '@angular/material/chips';
import { minSelectedItemsValidator } from 'src/app/core/validators';
import { campaignTypes } from '../../commons/tabs/details/campaing-types';

@Component({
  selector: 'app-general-setup',
  templateUrl: './general-setup.component.html',
  styleUrls: ['./general-setup.component.scss']
})

export class GeneralSetupComponent implements OnInit {
  bonusTypes = [];
  partners = [];
  clientType = [];
  finalAccountTypes = [];
  formGroup: UntypedFormGroup;
  fromDate = new Date();
  toDate = new Date();
  conditions = [];
  status = ACTIVITY_STATUSES;
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
  bonusTypeId;
  arr: UntypedFormArray;
  conditionTypes;
  campaigns = [];
  regularitys = REGULARITY;
  days = DAYS;
  isSendingRequest = false;
  campaignTypes = campaignTypes;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  counts: any[] = [50, 50];
  selectedCampaigns: number[];
  selectedCampaignIds: number[] = [];
  selectedType: number;
  selectedCampaignsByType: { [key: number]: number[] } = {};


  campaignControl: FormControl;
  valueControl: FormControl;
  allBounuses: any;

  constructor(
    public dialogRef: MatDialogRef<GeneralSetupComponent>,
    private apiService: CoreApiService,
    private commonDataService: CommonDataService,
    private fb: UntypedFormBuilder,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data,
    public dateAdapter: DateAdapter<Date>,
    private bonusesService: BonusesService) {
    this.dateAdapter.setLocale('en-GB');

    this.campaignControl = new FormControl('');
    this.valueControl = new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(10),
      this.integerValidator
    ]);
  }

  ngOnInit(): void {
    this.partners = this.commonDataService.partners;
    this.conditions = this.bonusesService.getConditions();
    this.getBounusTypes();
    this.formValues();
    this.getClientType();
    this.getOperationFilters();
  }

  getBounusTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.ENUMERATION, Methods.GET_BONUS_TYPES_ENUM)
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.bonusTypes = data.ResponseObject;
        }
      });
  }

  integerValidator(control: FormControl) {
    const value = control.value;
    return Number.isInteger(value) ? null : { integer: true };
  }

  getOperationFilters() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_FILTER_OPTIONS)
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.conditionTypes = data.ResponseObject;
        }
      });
  }

  onBonusChange(BonusTypeId) {
    this.bonusTypeId = BonusTypeId;
    this.handleValidators();
    if (this.bonusTypeId == 10) {
      this.conditions = this.conditions.filter(element => {
        return element.Id === 16;
      });
    }
    if (this.bonusTypeId == 14) {
      this.formGroup.get('AccountTypeId').setValue(3);
    }

    if (this.bonusTypeId == 4) {
      this.getBounuses();
      this.formGroup.setControl('Info', this.fb.array([]));
      this.formGroup.get('Info').setValidators([Validators.required, minSelectedItemsValidator(3)]);
    } else {
      this.formGroup.get('Info').setValue(null);
      this.formGroup.get('Info').clearValidators();
    }
    
    this.formGroup.get('Info').updateValueAndValidity();
  }

  handleValidators() {
    for (const fieldName in this.formGroup.controls) {
      this.formGroup.get(fieldName).clearValidators();
      this.formGroup.get(fieldName).updateValueAndValidity();
    }

    for (const fieldName in this.formGroup.controls) {
      this.formGroup.get(fieldName).updateValueAndValidity();
    }

    const selectedBonus = this.bonusTypes.find(fields => fields.Id === this.bonusTypeId);
    if (selectedBonus) {
      const validators = selectedBonus.BonusValidators || [];
      validators.forEach(key => {
        if (key === 'Name') {
          this.formGroup.get(key).setValidators([Validators.required]);
        } else {
          this.formGroup.get(key).setValidators([Validators.required, Validators.min(0)]);
        }
        this.formGroup.get(key).updateValueAndValidity();
      });

      if (this.bonusTypeId !== 5 && this.bonusTypeId !== 14) {
        this.formGroup.get('MinAmount').setValidators([Validators.required, Validators.min(0)]);
        this.formGroup.get('MaxAmount').setValidators([Validators.required, Validators.min(0)]);
        this.formGroup.get('MinAmount').updateValueAndValidity();
        this.formGroup.get('MaxAmount').updateValueAndValidity();
      }

      this.formGroup.get('PartnerId').setValidators([Validators.required, Validators.min(0)]);
      this.formGroup.get('Status').setValidators([Validators.required, Validators.min(0)]);
      this.formGroup.get('Name').setValidators([Validators.required, Validators.min(0)]);

    } else {
      console.error('Bonus type not found or BonusValidators is not iterable', this.bonusTypeId);
    }

    if (this.bonusTypeId === 5) {
      if (!this.formGroup.contains('counts')) {
        this.formGroup.addControl('counts', this.fb.array(this.counts.map(count => this.fb.control(count, [Validators.required, Validators.pattern(/^\d+$/)])), this.validateChipSum));
      }
    } else {
      if (this.formGroup.contains('counts')) {
        this.formGroup.removeControl('counts');
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    this.isSendingRequest = true;
    let bonus = this.formGroup.getRawValue();
    if (bonus.BonusTypeId == 12 || bonus.BonusTypeId == 13 || bonus.BonusTypeId == 10) {
      bonus.Conditions = this.bonusesService.getRequestConditions(this.addedConditions);
    }

    if (bonus.BonusTypeId == 5) {
      bonus.Info = bonus.counts.join(', ');
      delete bonus.counts;
    }

    if(bonus.BonusTypeId == 4) {
      bonus.Info = JSON.stringify(bonus.Info);
    }
    
    this.createBonus(bonus);
  }

  createBonus(request) {
    this.apiService.apiPost(this.configService.getApiUrl, request, true, Controllers.BONUS, Methods.CREATE_BONUS)
      .pipe(take(1))
      .subscribe(data1 => {
        if (data1.ResponseCode === 0) {
          this.dialogRef.close('success');
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data1.Description, Type: "error" });
        }
        this.isSendingRequest = false;
      });
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

  private formValues() {
    this.formGroup = this.fb.group({
      Name: [null],
      PartnerId: [null],
      BonusTypeId: [null],
      WinAccountTypeId: [null],
      FinalAccountTypeId: [null],
      MinAmount: [null],
      MaxAmount: [null],
      Status: [null],
      StartTime: [this.fromDate],
      FinishTime: [this.toDate],
      MaxGranted: [null],
      MaxReceiversCount: [null],
      Period: [null],
      PromoCode: [null],
      TurnoverCount: [null],
      Priority: [null],
      AutoApproveMaxAmount: [null],
      LinkedBonusId: [null],
      Percent: [null],
      Info: [null],
      AllowSplit: [false],
      RefundRollbacked: [false],
      ResetOnWithdraw: [false],
      LinkedCampaign: [false],
      Sequence: [null],
      ValidForAwarding: [null],
      ValidForSpending: [null],
      ReusingMaxCount: [null],
      Conditions: [null],
      FreezeBonusBalance: [null],
      Description: [null],
      Regularity: [null],
      DayOfWeek: [null],
      ReusingMaxCountInPeriod: [null],
    });
  }

  onStartDateChange(event) {
    this.formGroup.get('StartTime').setValue(event.value);
  }

  onFinishDateChange(event) {
    this.formGroup.get('FinishTime').setValue(event.value);
  }

  getClientType() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.ENUMERATION,
      Methods.GET_CLIENT_ACCOUNT_TYPES_ENUM).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.clientType = data.ResponseObject;
          this.finalAccountTypes = this.clientType
          // .filter(elem => elem.Id != 12);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  get countsArray() {
    return this.formGroup.get('counts') as FormArray;
  }

  validateChipSum(formArray: FormArray) {
    const sum = formArray.controls.reduce((acc, control) => acc + Number(control.value), 0);
    return sum === 100 ? null : { sumNotEqual100: true };
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

  onTypeChange(type: number) {
    this.selectedType = type;
    const obj = {
      PartnerId: this.formGroup.get('PartnerId')?.value,
      Status: 1,
      Type: type
    };
    this.apiService.apiPost(this.configService.getApiUrl, obj, true, Controllers.BONUS, Methods.GET_BONUSES)
      .pipe(take(1))
      .subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.campaigns = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  get infoArray() {
    return this.formGroup.get('Info') as FormArray;
  }

  addValue() {
    const campaign = this.campaignControl.value;
    const value = this.valueControl.value;
    if (campaign && value !== null && value !== undefined) {
      if (value > 10 || value < 1 ) {
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
        this.infoArray.removeAt(0);
        this.infoArray.push(this.fb.group(newValue));
      }
  
      this.campaignControl.reset();
      this.valueControl.reset();
  
      this.infoArray.updateValueAndValidity();
    } else {
      SnackBarHelper.show(this._snackBar, { Description: "Please select a campaign and enter a valid value.", Type: "error" });
    }
  }

  removeValue(index: number) {
    this.infoArray.removeAt(index);
    this.infoArray.updateValueAndValidity();
  }

  remove(count: number): void {
    const index = this.countsArray.controls.findIndex(control => control.value == count);
    if (index >= 0) {
      this.countsArray.removeAt(index);
    }
    this.countsArray.updateValueAndValidity();
  }

  onCampaignChange(selectedCampaignIds: number[]): void {
    this.selectedCampaignsByType[this.selectedType] = selectedCampaignIds;
    const allSelectedCampaignIds = Object.values(this.selectedCampaignsByType).flat();
  }

  updateInfoFormArray() {
    const infoArray = this.infoArray;
    const campaignIds = Object.values(this.selectedCampaignsByType).flat();
    campaignIds.forEach(campaignId => {
      const value = this.valueControl.value;
      if (value !== null && value !== undefined) {
        infoArray.push(this.fb.group({
          Campaign: campaignId,
          Value: value
        }));
      }
    });
  }

}
