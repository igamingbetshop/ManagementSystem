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

  public modes = [{ Id: 1, Name: "Static" }, { Id: 2, Name: "Dynamic" }];
  public genders = [{ Id: null, Name: 'All' }, { Id: 1, Name: 'Male' }, { Id: 2, Name: 'Female' }];
  public KYCStates = [{ Id: null, Name: 'All' }, { Id: true, Name: 'Yes' }, { Id: false, Name: 'No' }];
  public arrayTypeProps = ['AffiliateId', 'Bonus', 'ClientId', 'Email', 'FirstName', 'LastName', 'UserName', 'MobileCode', 'Region', 'SegmentId', 'SuccessDepositPaymentSystem', 'SuccessWithdrawalPaymentSystem'];
  public rules = [{ Id: 1, Name: "TD" }, { Id: 2, Name: "DC" }, { Id: 3, Name: "SBC" }, { Id: 4, Name: "CBC" }];
  public formGroup: UntypedFormGroup;
  public addedConditions: any = {};

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
      Name: [null, [Validators.required]],
      PartnerId: [null],
      State: [null],
      Mode: [null],
      CreationTime: [null],
      LastUpdateTime: [null],
      SegementSetting: this.fb.group({
        SegmentId: [null],
        Priority: [null],
        SocialLink: [null],
        AlternativeDomain: [null],
        ApiUrl: [null],
        ApiKey: [null],
        IsDefault: [null],
        DepositMinAmount: [null],
        DepositMaxAmount: [null],
        WithdrawMinAmount: [null],
        WithdrawMaxAmount: [null],
        CreationTime: [null],
        LastUpdateTime: [null],
        DomainTextTranslationKey: [null]
      }),
      IsKYCVerified: [null],
      Gender: [null],
      IsTermsConditionAccepted: [null],
      ClientStatus: [null],
      ClientStatusSet: [null],
      SegmentId: [null, [numbersAndCommas]],
      SegmentIdSet: [null],
      ClientId: [null],
      ClientIdSet: [null],
      Email: [null,  [emailsWithCommasValidator]],
      EmailSet: [null],
      FirstName: [null, [stringAndCommaValidator]],
      FirstNameSet: [null],
      LastName: [null, [stringAndCommaValidator]],
      LastNameSet: [null],
      Region: [null, [numbersAndCommas]],
      RegionSet: [null],
      AffiliateId: [null, [numbersAndCommas]],
      AffiliateIdSet: [null],
      MobileCode: [null, Validators.pattern(/^\+?\d+(\s*,\s*\+?\d+)*$/)],
      MobileCodeSet: this.fb.group({
        ConditionItems: this.fb.array([
          this.fb.group({
            OperationTypeId: [null],
            StringValue: [null],
          })
        ])
      }),
      SessionPeriod: [null],
      SessionPeriodSet: [null],
      SignUpPeriod: [null],
      SignUpPeriodSet: [null],
      Profit: [null],
      ProfitObject: [null],
      Bonus: [null],
      BonusSet: [null],
      SuccessDepositPaymentSystem: [null, [numbersAndCommas]],
      SuccessDepositPaymentSystemObject: [null],
      SuccessWithdrawalPaymentSystem: [null],
      SuccessWithdrawalPaymentSystemObject: [null],
      TotalBetsCount: [null],
      TotalBetsCountObject: this.fb.group({
        ConditionItems: this.fb.array([
          this.fb.group({
            OperationTypeId: [null],
            StringValue: [null],
          })
        ])
      }),
      SportBetsCount: [null],
      SportBetsCountObject: this.fb.group({
        ConditionItems: this.fb.array([
          this.fb.group({
            OperationTypeId: [null],
            StringValue: [null],
          })
        ])
      }),
      CasinoBetsCount: [null],
      CasinoBetsCountObject: this.fb.group({
        ConditionItems: this.fb.array([
          this.fb.group({
            OperationTypeId: [null],
            StringValue: [null],
          })
        ])
      }),
      TotalBetsAmount: [null],
      TotalBetsAmountObject: this.fb.group({
        ConditionItems: this.fb.array([
          this.fb.group({
            OperationTypeId: [null],
            StringValue: [null],
          })
        ])
      }),
      TotalDepositsCount: [null],
      TotalDepositsCountObject: this.fb.group({
        ConditionItems: this.fb.array([
          this.fb.group({
            OperationTypeId: [null],
            StringValue: [null],
          })
        ])
      }),
      TotalDepositsAmount: [null],
      TotalDepositsAmountObject: this.fb.group({
        ConditionItems: this.fb.array([
          this.fb.group({
            OperationTypeId: [null],
            StringValue: [null],
          })
        ])
      }),
      TotalWithdrawalsCount: [null],
      TotalWithdrawalsCountObject: this.fb.group({
        ConditionItems: this.fb.array([
          this.fb.group({
            OperationTypeId: [null],
            StringValue: [null],
          })
        ])
      }),
      TotalWithdrawalsAmount: [null],
      TotalWithdrawalsAmountObject: this.fb.group({
        ConditionItems: this.fb.array([
          this.fb.group({
            OperationTypeId: [null],
            StringValue: [null],
          })
        ])
      }),
      ComplimentaryPoint: [null],
      ComplimentaryPointObject: this.fb.group({
        ConditionItems: this.fb.array([
          this.fb.group({
            OperationTypeId: [null],
            StringValue: [null],
          })
        ])
      }),
    });
  }

  ngOnInit() {
    this.setAdditionals();
    this.clientStates = this.activateRoute.snapshot.data.clientStates.map(item => {
      item.checked = false;
      return item;
    });
    this.segmentId = this.activateRoute.snapshot.queryParams.segmentId;
    this.partners = this.commonDataService.partners;
    this.getFilterOperation();
    this.getPaymentSegmentById();
  }

  setAdditionals() {
    this.addedConditions = {
      SessionPeriodObject: {
        conditions: [],
        selectedConditionType: null,
        selectedConditionValue: null,
        opened: false,
        showNew: false
      },
      SignUpPeriodObject: {
        conditions: [],
        selectedConditionType: null,
        selectedConditionValue: new Date(),
        opened: false,
        showNew: false
      },
      CasinoBetsCountObject: {
        conditions: [],
        selectedConditionType: null,
        selectedConditionValue: null,
        showNew: false
      },
      ComplimentaryPointObject: {
        conditions: [],
        selectedConditionType: null,
        selectedConditionValue: null,
        showNew: false
      },
      SportBetsCountObject: {
        conditions: [],
        selectedConditionType: null,
        selectedConditionValue: null,
        showNew: false
      },
      TotalBetsCountObject: {
        conditions: [],
        selectedConditionType: null,
        selectedConditionValue: null,
        showNew: false
      },
      TotalBetsAmountObject: {
        conditions: [],
        selectedConditionType: null,
        selectedConditionValue: null,
        showNew: false
      },
      TotalDepositsCountObject: {
        conditions: [],
        selectedConditionType: null,
        selectedConditionValue: null,
        showNew: false
      },
      TotalDepositsAmountObject: {
        conditions: [],
        selectedConditionType: null,
        selectedConditionValue: null,
        showNew: false
      },
      TotalWithdrawalsCountObject: {
        conditions: [],
        selectedConditionType: null,
        selectedConditionValue: null,
        showNew: false
      },
      TotalWithdrawalsAmountObject: {
        conditions: [],
        selectedConditionType: null,
        selectedConditionValue: null,
        showNew: false
      }
    }
  }


  onCancle() {
    this.isEdit = false;
    this.setAdditionals();
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

  addDateCondition(item) {
    if (item.selectedConditionType && item.selectedConditionValue) {
      item.conditions.push({ ConditionType: item.selectedConditionType, ConditionValue: item.selectedConditionValue });
      item.selectedConditionType = null;
      item.selectedConditionValue = new Date();
      item.opened = false;
      item.showNew = false;
    }
  };

  removeCondition(item, index) {
    item.conditions.splice(index, 1);
  };

  addCondition(item) {
    if (item.selectedConditionType && item.selectedConditionValue) {
      item.conditions.push({ ConditionType: item.selectedConditionType, ConditionValue: item.selectedConditionValue });
      item.selectedConditionType = null;
      item.selectedConditionValue = null;
      item.showNew = false;
    }
  };

  getPaymentSegmentById() {
    this.apiService.apiPost(this.configService.getApiUrl, { Id: this.segmentId }, true,
      Controllers.CONTENT, Methods.GET_SEGMENTS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.PaymentSegment = data.ResponseObject.map((obj) => {
            obj.GenderName = this.genders.find(item => item.Id === obj.Gender)?.Name;
            obj.ModeName = this.modes.find(item => item.Id === obj.Mode)?.Name;
            obj.IsKYCVerifiedName = this.KYCStates.find(item => item.Id === obj.IsKYCVerified)?.Name;
            obj.PartnerName = this.partners.find((item => item.Id === obj.PartnerId))?.Name;
            return obj;
          })[0];
          this.clientStates?.forEach(item => {
            item.checked = this.PaymentSegment?.ClientStatus.includes(item.Id);
          });

          Object.keys(this.addedConditions).forEach(key => {
            this.PaymentSegment[key]
              ? this.PaymentSegment[key].ConditionItems.forEach(condObj => {
                this.addedConditions[key].conditions.push({
                  ConditionType: this.operations.find(item => item.Id === condObj.OperationTypeId),
                  ConditionValue: condObj.StringValue
                });
              }) : [];
          })
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
          this.setAdditionals();
          this.getPaymentSegmentById();
        } else {
          this.PaymentSegment = Object.assign({}, oldData);
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }


}

