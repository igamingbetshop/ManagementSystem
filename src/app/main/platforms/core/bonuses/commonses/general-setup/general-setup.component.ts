import { Component, Inject, OnInit } from '@angular/core';
import { CoreApiService } from "../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../core/services";
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Controllers, Methods } from "../../../../../../core/enums";
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { DateAdapter } from "@angular/material/core";
import { take } from "rxjs/operators";
import { BonusesService } from "../../bonuses.service";
import { ACTIVITY_STATUSES, DAYS, REGULARITY } from 'src/app/core/constantes/statuses';

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

  regularitys = REGULARITY;
  days = DAYS;
  isSendingReqest = false; 

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

  onBonusChange(BonusTypeId) {
    this.bonusTypeId = BonusTypeId;
    this.handleValidators();
    if (this.bonusTypeId == 10) {
      this.conditions = this.conditions.filter(element => {
        return element.Id === 16
      })
    }
    if (this.bonusTypeId == 14) {
      this.formGroup.get('AccountTypeId').setValue(3);
    }
  }

  handleValidators() {
    for (const fieldName in this.formGroup.controls) {
      this.formGroup.get(fieldName).clearValidators();
      this.formGroup.get(fieldName).updateValueAndValidity();
    }

    this.bonusTypes.forEach(fields => {
      if (fields.Id === this.bonusTypeId) {
        for (const key of fields.BonusValidators) {
          if (key === 'Name') {
            this.formGroup.get(key).setValidators([Validators.required]);
          } else {
            this.formGroup.get(key).setValidators([Validators.required, Validators.min(0)]);
          }

          this.formGroup.get(key).setValidators(Validators.required);
          this.formGroup.get(key).updateValueAndValidity();
        }
      }
    })
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    this.isSendingReqest = true; 
    const bonus = this.formGroup.getRawValue();
    if (bonus.BonusTypeId == 12 || bonus.BonusTypeId == 13 || bonus.BonusTypeId == 10) {
      bonus.Conditions = this.bonusesService.getRequestConditions(this.addedConditions);
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
        this.isSendingReqest = false; 
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
  };

  removeCondition(item, index) {
    item.conditions.splice(index, 1);
  };

  removeGroup(item, index) {
    item.groups.splice(index, 1);
  };

  private formValues() {
    this.formGroup = this.fb.group({
      Name: [null],
      PartnerId: [null],
      BonusTypeId: [null],
      WinAccountTypeId: [null],
      FinalAccountTypeId: [null],
      MinAmount: [null],
      MaxAmount: [null],
      Status: [false],
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
      ReusingMaxCountInPeriod: [null]
    })
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
          this.finalAccountTypes = this.clientType.filter(elem => elem.Id != 12);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  get errorControl() {
    return this.formGroup.controls;
  }
}
