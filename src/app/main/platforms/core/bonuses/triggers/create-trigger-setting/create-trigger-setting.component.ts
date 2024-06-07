import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CoreApiService } from "../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../core/services";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Controllers, Methods } from "../../../../../../core/enums";
import { DateAdapter } from "@angular/material/core";
import { take } from "rxjs/operators";
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { BonusesService } from "../../bonuses.service";
import { DAYS } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-create-trigger-setting',
  templateUrl: './create-trigger-setting.component.html',
  styleUrls: ['./create-trigger-setting.component.scss']
})
export class CreateTriggerSettingComponent implements OnInit {
  partners = [];
  triggerTypes = [];
  conditions = [
    { Id: 1, Name: 'Sport', Type: 1 },
    { Id: 2, Name: 'Region', Type: 1 },
    { Id: 3, Name: 'Competition', Type: 1 },
    { Id: 4, Name: 'Match', Type: 1 },
    { Id: 5, Name: 'Market', Type: 1 },
    { Id: 6, Name: 'Selection', Type: 1 },
    { Id: 7, Name: 'MarketType', Type: 1 },
    { Id: 8, Name: 'SelectionType', Type: 1 },
    { Id: 9, Name: 'MatchStatus', Type: 1 },
    { Id: 10, Name: 'Price', Type: 1 },
    { Id: 11, Name: 'PricePerSelection', Type: 1 },
    { Id: 12, Name: 'BetType', Type: 1 },
    { Id: 13, Name: 'NumberOfSelections', Type: 1 },
    { Id: 14, Name: 'NumberOfWonSelections', Type: 1 },
    { Id: 15, Name: 'NumberOfLostSelections', Type: 1 },
    { Id: 16, Name: 'Stake', Type: 1 },
    { Id: 17, Name: 'BetStatus', Type: 1 }
  ];
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
  days = DAYS;
  sources = [
    { Id: 1, Name: 'BetAmount' },
    { Id: 2, Name: 'WinAmount' }
  ];
  formGroup: UntypedFormGroup;
  fromDate = new Date();
  toDate = new Date();
  type;
  conditionTypes;
  isSendingReqest = false;

  constructor(
    public dialogRef: MatDialogRef<CreateTriggerSettingComponent>,
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
    this.getTriggerTypes();
    this.getOperationFilters();
    this.formValues();
  }

  getTriggerTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.ENUMERATION, Methods.GET_TRIGGER_TYPES_ENUM)
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.triggerTypes = this.getTriggerValidators(data.ResponseObject);

        }
      })
  }

  getOperationFilters() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.ENUMERATION, Methods.GET_FILTER_OPTIONS)
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.conditionTypes = data.ResponseObject;
        }
      })
  }

  getTriggerValidators(triggerTypes: { [key: string]: any }[]) {
    return triggerTypes.map(field => {
      let validators = ['Name', 'PartnerId', 'Description'];
      switch (field.Id) {
        case 8:
          validators.push('Percent');
          break;
        case 1:
          validators.push('Percent', 'MinAmount', 'MinBetCount');
          break;
        case 3:
        case 2:
          validators.push('Percent', 'MinAmount', 'MinBetCount', 'BonusSettingCodes');
          break;
        case 4:
          validators.push('BonusSettingCodes');
          break;
        case 7:
          validators.push('Percent', 'Sequence');
          break;
        case 11:
          validators.push('BonusSettingCodes');
          break;
        case 12:
          validators.push('BonusSettingCodes');
          break;
        case 13:
          validators.push('SegmentId');
          break;
      }

      return {
        TriggerValidators: validators,
        ...field
      }
    });
  }

  onBonusChange(BonusTypeId) {
    this.type = BonusTypeId;
    this.handleValidators();
  }

  handleValidators() {
    for (const fieldName in this.formGroup.controls) {
      this.formGroup.get(fieldName).clearValidators();
      this.formGroup.get(fieldName).updateValueAndValidity();
    }

    this.triggerTypes.forEach(fields => {
      if (fields.Id === this.type) {
        for (const key of fields.TriggerValidators) {
          if (key === 'Name' || key === 'Description' || key === 'BonusSettingCodes') {
            this.formGroup.get(key).setValidators([Validators.required]);
          } else {
            this.formGroup.get(key).setValidators([Validators.required, Validators.min(0)]);
          }
          this.formGroup.get(key).updateValueAndValidity();
        }
      }
    })
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formGroup.invalid || this.isSendingReqest) {
      return;
    }
    const triggerSetting = this.formGroup.getRawValue();
    this.isSendingReqest = true;
    if (triggerSetting.Type == 1 || triggerSetting.Type == 2 || triggerSetting.Type == 3) {
      triggerSetting.Conditions = this.bonusesService.getRequestConditions(this.addedConditions);
    }
    this.saveTriggerSettings(triggerSetting);
  }

  saveTriggerSettings(request) {
    this.apiService.apiPost(this.configService.getApiUrl, request, true, Controllers.BONUS, Methods.SAVE_TRIGGER_SETTING)
      .pipe(take(1))
      .subscribe(trigger => {
        if (trigger.ResponseCode === 0) {
          this.dialogRef.close('success');
        } else {
          SnackBarHelper.show(this._snackBar, { Description: trigger.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      })
  }

  onStartDateChange(event) {
    this.formGroup.get('StartTime').setValue(event.value);
  }

  onFinishDateChange(event) {
    this.formGroup.get('FinishTime').setValue(event.value);
  }

  addGroup(item) {
    item.groups.push(
      {
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
      Amount: [null],
      PartnerId: [null],
      Type: [null],
      Description: [null],
      Percent: [null],
      StartTime: [this.fromDate],
      FinishTime: [this.toDate],
      DayOfWeek: [null],
      MinAmount: [null],
      SegmentId: [null],
      MaxAmount: [null],
      MinBetCount: [null],
      UpToAmount: [null],
      BonusSettingCodes: [null],
      Sequence: [null],
      Status: [1],
      ConsiderBonusBets: [null],
    });
  }

  static nonZero(control: any) {
    if (Number(control.value) < 0) {
      control.setErrors({ nonZero: true })
    } else {
      control.setErrors(null)
    }
  }

  get errorControl() {
    return this.formGroup.controls;
  }
}
