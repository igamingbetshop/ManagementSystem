import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { Controllers, Methods } from 'src/app/core/enums';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { CoreApiService } from '../../services/core-api.service';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { emailsWithCommasValidator, numbersAndCommas, stringAndCommaValidator } from 'src/app/core/validators';


@Component({
  selector: 'app-add-segment',
  templateUrl: './add-segment.component.html',
  styleUrls: ['./add-segment.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ]
})

export class AddSegmentComponent implements OnInit {

  clientStates: any[] = [];
  ClientStatus: any = {};
  partners: any[] = [];
  formGroup: UntypedFormGroup;
  operations: any[] = [];

  modes = [{ Id: 1, Name: "Common.Static" }, { Id: 2, Name: "Common.Dynamic" }];
  genders = [{ Id: null, Name: 'Common.All' }, { Id: 1, Name: 'Common.Male' }, { Id: 2, Name: 'Common.Female' }];
  KYCStates = [{ Id: null, Name: 'Common.All' }, { Id: 1, Name: 'Common.Yes' }, { Id: 0, Name: 'Common.No' }];
  termsConditionStates = [{ Id: null, Name: 'Common.All' }, { Id: 1, Name: 'Common.Yes' }, { Id: 0, Name: 'Common.No' }];
  isSendingReqest = false; 
  arrayTypeProps = ['AffiliateId', 'Bonus', 'ClientId', 'Email', 'FirstName', 'LastName', 'UserName', 'MobileCode', 'Region', 'SegmentId', 'SuccessDepositPaymentSystem', 'SuccessWithdrawalPaymentSystem'];

  addedConditions = {
    SessionPeriod: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: new Date(),
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
      selectedConditionValue: null,
      showNew: false
    },
    ComplimentaryPoint: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: null,
      showNew: false
    },
    SportBetsCount: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: null,
      showNew: false
    },
    TotalBetsCount: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: null,
      showNew: false
    },
    TotalBetsAmount: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: null,
      showNew: false
    },
    TotalDepositsCount: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: null,
      showNew: false
    },
    TotalDepositsAmount: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: null,
      showNew: false
    },
    TotalWithdrawalsCount: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: null,
      showNew: false
    },
    TotalWithdrawalsAmount: {
      conditions: [],
      selectedConditionType: null,
      selectedConditionValue: null,
      showNew: false
    }
  };

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<AddSegmentComponent>,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    private configService: ConfigService,
    private apiService: CoreApiService,
    @Inject(MAT_DIALOG_DATA) public data: { ClientStates: any, FilterOperating: any },
    public dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    this.partners = this.commonDataService.partners;
    this.operations = this.data.FilterOperating.filter(el => {
      return el.NickName != "Contains" && el.NickName != "StartsWith" && el.NickName != "DoesNotContain" && el.NickName != "EndsWith";
    });
    this.clientStates = this.data.ClientStates.map(item => {
      item.Name = item.Name.split(" ").join("")
      item.checked = false;
      return item;
    });
    this.setForm();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  close() {
    this.dialogRef.close();
  }

  private setForm() {
    this.formGroup = this.fb.group({
      PartnerId: [null, [Validators.required]],
      Name: [null, [Validators.required]],
      Mode: [1],
      Gender: [null],
      IsKYCVerified: [null],
      AffiliateId: [null, [numbersAndCommas]], 
      // Bonus: [null],
      ClientId: [null, [numbersAndCommas]],
      SuccessDepositPaymentSystem: [null, [numbersAndCommas]],
      Email: [null, [emailsWithCommasValidator]],
      FirstName: [null, [stringAndCommaValidator] ],
      LastName: [null, [stringAndCommaValidator]],
      MobileCode: [null, Validators.pattern(/^\+?\d+(\s*,\s*\+?\d+)*$/)],
      Region: [null, [numbersAndCommas]],
      SegmentId: [null, [numbersAndCommas]],
      SuccessWithdrawalPaymentSystem: [null, [numbersAndCommas]],
    })
  }

  addCondition(item) {
    if (item.selectedConditionType && item.selectedConditionValue) {
      item.conditions.push({ ConditionType: item.selectedConditionType, ConditionValue: item.selectedConditionValue });
      item.selectedConditionType = null;
      item.selectedConditionValue = null;
      item.showNew = false;
    }
  };

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

  onSubmit() {
    if (!this.formGroup.valid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    this.isSendingReqest = true; 
    this.arrayTypeProps.filter(prop => !!obj[prop]).forEach(key => {
      obj[key] = {
        ConditionItems: obj[key].split(',').map(item => {
          return {
            OperationTypeId: 1,
            StringValue: item.trim()
          }
        })
      }
    });

    Object.keys(this.addedConditions).forEach(key => {
      obj[key] = {
        ConditionItems: this.addedConditions[key].conditions.map(item => {
          return {
            OperationTypeId: item.ConditionType.Id,
            StringValue: item.ConditionValue
          }
        })
      }
    });

    this.ClientStatus = {
      ConditionItems: this.clientStates.filter(item => item.checked).map(item => {
        return {
          OperationTypeId: 1,
          StringValue: item.Id
        }
      })
    };

    obj.ClientStatus = this.ClientStatus;
    this.saveSegment(obj);
  }

  saveSegment(obj) {
    this.apiService.apiPost(this.configService.getApiUrl, obj, true,
      Controllers.CONTENT, Methods.SAVE_SEGMENT).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false; 
      });
  }
}
