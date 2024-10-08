import { Component, OnInit, signal, WritableSignal } from '@angular/core';
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

  PaymentSegment: WritableSignal<any> = signal([]);
  isSendingRequest = false;
  clientStates: any[] = [];
  ClientStatus: any = {};
  partners: any[] = [];
  operations: any[] = [];
  segmentId;
  SegmentSetting;
  isEdit = false;
  statuses = ACTIVITY_STATUSES;
  modes = MODES;
  genders = [{ Id: null, Name: 'All' }, { Id: 1, Name: 'Male' }, { Id: 2, Name: 'Female' }];
  commonStates = [{ Id: null, Name: 'All' }, { Id: true, Name: 'Yes' }, { Id: false, Name: 'No' }];
  arrayTypeProps = ['AffiliateId', 'Bonus', 'ClientId', 'Email', 'FirstName', 'LastName', 'UserName', 'MobileCode', 'Region', 'SegmentId', 'SuccessDepositPaymentSystem', 'SuccessWithdrawalPaymentSystem', 'ClientStatus'];
  rules = [{ Id: 1, Name: "TD" }, { Id: 2, Name: "DC" }, { Id: 3, Name: "SBC" }, { Id: 4, Name: "CBC" }];
  formGroup: UntypedFormGroup;
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
      Mode: [null],
      State: [null],
      Status: [null],
      Gender: [null],
      IsKYCVerified: [null],
      IsEmailVerified: [null],
      IsMobileNumberVerified: [null],
      ClientId: [null, [numbersAndCommas]],
      AffiliateId: [null, [numbersAndCommas]],
      ClientStatus: [null],
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
      const formattedDate = this.formatDateToYYYYMMDD(item.selectedConditionValue);
      item.conditions.push({
        ConditionType: item.selectedConditionType,
        ConditionValue: formattedDate
      });
      item.selectedConditionType = null;
      item.selectedConditionValue = resetToDate ? this.formatDateToYYYYMMDD(new Date()) : null;
      item.opened = false;
      item.showNew = false;
    }
  }
  
  formatDateToYYYYMMDD(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
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
      Controllers.CONTENT, Methods.GET_SEGMENTS).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.PaymentSegment.set(data.ResponseObject[0]);
          this.clientStates?.forEach(item => {
            item.checked = this.PaymentSegment()['ClientStatus'].includes(item.Id);
          });
  
          Object.keys(this.addedConditions).forEach(key => {
            const conditionObjectKey = `${key}Object`;
            const conditionObject = this.PaymentSegment()[conditionObjectKey];
  
            if (conditionObject && conditionObject.ConditionItems) {
              this.addedConditions[key].conditions = conditionObject.ConditionItems.map(condObj => ({
                ConditionType: this.operations.find(item => item.Id === condObj.OperationTypeId),
                ConditionValue: condObj.StringValue
              }));
            } else {
              this.addedConditions[key].conditions = [];
            }
          });
  
          this.SegmentSetting = this.PaymentSegment()['SegmentSetting'];
          if (this.PaymentSegment()) {
            this.formGroup.patchValue(this.PaymentSegment());
          }
          
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  transformArrayTypeProps(requestObj) {
    if (requestObj.MobileCode != null) {
      requestObj.MobileCode = {
        ConditionItems: requestObj.MobileCode.toString().split(',').map(item => {
          return {
            OperationTypeId: 1,
            StringValue: item.trim()
          };
        })
      };
    }

    this.arrayTypeProps.filter(prop => !!requestObj[prop]).forEach(key => {
      if (typeof requestObj[key] === 'string') {
        requestObj[key] = {
          ConditionItems: requestObj[key].split(',').map(item => {
            return {
              OperationTypeId: 1,
              StringValue: item.trim()
            };
          })
        };
      }
    });
  }

  transformAddedConditions(requestObj) {
    Object.keys(this.addedConditions).forEach(key => {
      if (this.addedConditions[key].conditions) {
        requestObj[key.replace('Object', '')] = {
          ConditionItems: this.addedConditions[key].conditions.map(item => {
            return {
              OperationTypeId: item.ConditionType?.Id,
              StringValue: item?.ConditionValue != null ? item.ConditionValue.toString() : ''
            };
          })
        };
      }
    });
  }

  transformClientStates() {
    return {
      ConditionItems: this.clientStates.filter(item => item.checked).map(item => {
        return {
          OperationTypeId: 1,
          StringValue: item.Id
        };
      })
    };
  }

  onSubmit() {
    let requestObj = this.formGroup.getRawValue();

    console.log(requestObj, "requestObj befor");

    let oldData = this.formGroup.getRawValue();
    this.isSendingRequest = true; 
    this.transformArrayTypeProps(requestObj);
    this.transformAddedConditions(requestObj);
    requestObj.ClientStatus = this.transformClientStates();  

    console.log(requestObj, "requestObj");
    
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
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingRequest = false;
      });
  }

  onConditionsChange(newConditions: any[], key: string) {
    this.addedConditions[key].conditions = newConditions;
  }

}