import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Controllers, Methods } from 'src/app/core/enums';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { CoreApiService } from '../../../../services/core-api.service';
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { DateAdapter } from "@angular/material/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { emailsWithCommasValidator, numbersAndCommas, stringAndCommaValidator } from 'src/app/core/validators';
import { ACTIVITY_STATUSES, MODES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  public PaymentSegment: any;

  public clientStates: any[] = [];
  public ClientStatus: any = {};
  public partners: any[] = [];
  public operations: any[] = [];
  public segmentId;
  public SegmentSetting;
  public isEdit = false;
  statuses = ACTIVITY_STATUSES;
  public modes = MODES;
  public genders = [{ Id: null, Name: 'All' }, { Id: 1, Name: 'Male' }, { Id: 2, Name: 'Female' }];
  public commonStates = [{ Id: null, Name: 'All' }, { Id: true, Name: 'Yes' }, { Id: false, Name: 'No' }];
  public arrayTypeProps = ['AffiliateId', 'Bonus', 'ClientId', 'Email', 'FirstName', 'LastName', 'UserName', 'MobileCode', 'Region', 'SegmentId', 'SuccessDepositPaymentSystem', 'SuccessWithdrawalPaymentSystem'];
  public rules = [{ Id: 1, Name: "TD" }, { Id: 2, Name: "DC" }, { Id: 3, Name: "SBC" }, { Id: 4, Name: "CBC" }];
  public formGroup: UntypedFormGroup;
  addedConditions = {
    SessionPeriod: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: '',
      opened: false,
      showNew: false
    },
    SignUpPeriod: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: new Date(),
      opened: false,
      showNew: false
    },
    CasinoBetsCount: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: '',
      showNew: false
    },
    ComplimentaryPoint: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: '',
      showNew: false
    },
    SportBetsCount: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: '',
      showNew: false
    },
    TotalBetsCount: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: '',
      showNew: false
    },
    TotalBetsAmount: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: '',
      showNew: false,
    },
    TotalDepositsCount: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: '',
      showNew: false
    },
    TotalDepositsAmount: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: '',
      showNew: false
    },
    TotalWithdrawalsCount: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: '',
      showNew: false
    },
    TotalWithdrawalsAmount: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: '',
      showNew: false
    },
    AffiliateId: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: '',
      showNew: false
    },
    AgentId: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: '',
      showNew: false
    }
  };

  constructor(
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    private configService: ConfigService,
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    public dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
    this.formGroup = this.fb.group({
      Id: [null],
      PartnerId: [null, [Validators.required]],
      Name: [null, [Validators.required]],
      Mode: [2],
      State: [1],
      Status: [null],
      Gender: [null],
      IsKYCVerified: [null],
      IsEmailVerified: [null],
      IsMobileNumberVerified: [null],
      ClientId: [null, [numbersAndCommas]],
      SuccessDepositPaymentSystem: [null, [numbersAndCommas]],
      Email: [null, [emailsWithCommasValidator]],
      FirstName: [null, [stringAndCommaValidator]],
      LastName: [null, [stringAndCommaValidator]],
      MobileCode: [null, Validators.pattern(/^\+?\d+(\s*,\s*\+?\d+)*$/)],
      Region: [null, [numbersAndCommas]],
      SegmentId: [null, [numbersAndCommas]],
      SuccessWithdrawalPaymentSystem: [null, [numbersAndCommas]],
    });
  }

  ngOnInit() {
    this.clientStates = this.activateRoute.snapshot.data.clientStates.map(item => {
      item.checked = false;
      return item;
    });
    this.segmentId = this.activateRoute.snapshot.queryParams.segmentId;
    this.partners = this.commonDataService.partners;
    this.getFilterOperation();
    this.getPaymentSegmentById();
  }


  onCancle() {
    this.isEdit = false;
    this.getPaymentSegmentById();
  }

  getFilterOperation() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_FILTER_OPTIONS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.operations = data.ResponseObject.filter(el => {
            return el.NickName != "Contains" && el.NickName != "StartsWith" && el.NickName != "DoesNotContain" && el.NickName != "EndsWith";
          });

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  addDateCondition(item, resetToDate = false) {
    if (item.selectedConditionType && item.selectedConditionValue) {
      item.conditions.push({
        ConditionType: item.selectedConditionType,
        ConditionValue: item.selectedConditionValue
      });
      item.selectedConditionType = null;
      item.selectedConditionValue = resetToDate ? new Date() : null;
      item.opened = false;
      item.showNew = false;
    }
  }

  removeCondition(item, index) {
    item.conditions.splice(index, 1);
  };

  addCondition(item) {
    if (item.selectedConditionType) {
      item.conditions.push({ ConditionType: item.selectedConditionType, ConditionValue: item.selectedConditionValue });
      item.selectedConditionType = null;
      item.selectedConditionValue = new Date();
      item.showNew = false;
    }
  };

  getPaymentSegmentById() {
    this.apiService.apiPost(this.configService.getApiUrl, { Id: this.segmentId }, true,
      Controllers.CONTENT, Methods.GET_SEGMENTS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.PaymentSegment = data.ResponseObject[0];
          this.clientStates?.forEach(item => {
            item.checked = this.PaymentSegment?.ClientStatus.includes(item.Id);
          });

          Object.keys(this.addedConditions).forEach(key => {
            const conditionObjectKey = `${key}Object`;
            const conditionObject = this.PaymentSegment[conditionObjectKey];
  
            if (conditionObject && conditionObject.ConditionItems) {
              this.addedConditions[key].conditions = conditionObject.ConditionItems.map(condObj => ({
                ConditionType: this.operations.find(item => item.Id === condObj.OperationTypeId),
                ConditionValue: condObj.StringValue
              })
              );
            } else {
              this.addedConditions[key].conditions = [];
            }
          }
          );
              
          this.SegmentSetting = this.PaymentSegment.SegementSetting;
          this.formGroup.patchValue(this.PaymentSegment);

          
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onSubmit() {
    let requestObj = this.formGroup.getRawValue();
    let oldData = this.formGroup.getRawValue();

    this.arrayTypeProps.filter(prop => !!requestObj[prop]).forEach(key => {
      requestObj[key] = {
        ConditionItems: requestObj[key].split(',').map(item => {
          return {
            OperationTypeId: 1,
            StringValue: item.trim()
          }
        })
      }
    });

    Object.keys(this.addedConditions).forEach(key => {
      if (this.addedConditions[key].conditions) requestObj[key.replace('Object', '')] = {
        ConditionItems: this.addedConditions[key].conditions.map(item => {
          return {
            OperationTypeId: item.ConditionType?.Id,
            StringValue: item?.ConditionValue
          }
        })
      }
    });

    requestObj.ClientStatus = {
      ConditionItems: this.clientStates.filter(item => item.checked).map(item => {
        return {
          OperationTypeId: 1,
          StringValue: item.Id
        }
      })
    };

    this.saveSegment(requestObj, oldData);

  }

  saveSegment(data, oldData) {
    this.apiService.apiPost(this.configService.getApiUrl, data, true,
      Controllers.CONTENT, Methods.SAVE_SEGMENT).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          Object.values(this.addedConditions).forEach(val => {
            val['showNew'] = false;
          });
          this.isEdit = false;
          this.getPaymentSegmentById();
        } else {
          this.PaymentSegment = Object.assign({}, oldData);
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }


}

