import { CommonModule } from '@angular/common';
import { Component, Inject, input, OnInit, signal, WritableSignal } from '@angular/core';
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
import { DateAdapter, MatNativeDateModule, MatPseudoCheckboxModule } from '@angular/material/core';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { emailsWithCommasValidator, numbersAndCommas, stringAndCommaValidator } from 'src/app/core/validators';
import { ActivatedRoute } from "@angular/router";
import { ACTIVITY_STATUSES } from 'src/app/core/constantes/statuses';
import { CollapseDirective } from 'src/app/core/directives/collapse.directive';
import { ToggleContentDirective } from 'src/app/core/directives/toggle-content.directive';
import { IdToNamePipe } from "../../../../../core/pipes/id-to-name-pipe";
import { ConditionInputComponent } from "../condition-input/condition-input.component";

export enum UserIcons {
  iconUserActive,
  iconUserBlockedForBet,
  iconUserBlockedForDeposit,
  iconUserBlockedForWithdraw,
  iconDisabled,
  iconUserForceBlock,
  iconUserFullBlock,
  iconUserSuspended,
}

export const UserIconMap = {
  [UserIcons.iconUserActive]: 'icon-useractive',
  [UserIcons.iconUserBlockedForBet]: 'icon-user-bloked-for-bet',
  [UserIcons.iconUserBlockedForDeposit]: 'icon-user-bloked-for-deposit',
  [UserIcons.iconUserBlockedForWithdraw]: 'icon-user-blocked-for-withdraw',
  [UserIcons.iconDisabled]: 'icon-user-disabled',
  [UserIcons.iconUserForceBlock]: 'icon-user-force-block',
  [UserIcons.iconUserFullBlock]: 'icon-user-full-blocked',
  [UserIcons.iconUserSuspended]: 'icon-user-suspended',

};

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
    MatDialogModule,
    MatButtonModule,
    MatPseudoCheckboxModule,
    ToggleContentDirective,
    CollapseDirective,
    IdToNamePipe,
    ConditionInputComponent
]
})

export class AddSegmentComponent implements OnInit {

  clientStates: any[] = [];
  ClientStatus: any = {};
  partners: any[] = [];
  formGroup: UntypedFormGroup;
  operations: any[] = [];
  statuses = ACTIVITY_STATUSES;
  modes = [{ Id: 1, Name: "Common.Static", Info: "Common.InfoStatic" }, { Id: 2, Name: "Common.Dynamic", Info: "Common.InfoDynamic" }];
  genders = [{ Id: null, Name: 'Common.All' }, { Id: 1, Name: 'Common.Male' }, { Id: 2, Name: 'Common.Female' }];
  commonStates = [{ Id: null, Name: 'Common.All' }, { Id: 1, Name: 'Common.Yes' }, { Id: 0, Name: 'Common.No' }];
  termsConditionStates = [{ Id: null, Name: 'Common.All' }, { Id: 1, Name: 'Common.Yes' }, { Id: 0, Name: 'Common.No' }];
  isSendingRequest = false;
  arrayTypeProps = ['AffiliateId', 'Bonus', 'ClientId', 'Email', 'FirstName', 'LastName', 'UserName', 'MobileCode', 'Region', 'SegmentId', 'SuccessDepositPaymentSystem', 'SuccessWithdrawalPaymentSystem'];
  showMore: WritableSignal<boolean> = signal<boolean>(false);
  showReview: WritableSignal<boolean> = signal<boolean>(false);
  PartnerName: string = '';
  Name: string = '';
  Mode: string = '';
  Status: string = '';
  GenderName: string = '';
  KYCVerifiedName: string = '';
  EmailVerifiedName: string = '';
  MobileNumberVerifiedName: string = '';
  StatusName: string = '';
  AffiliateId: string = '';
  ClientId: string = '';
  SuccessDepositPaymentSystem: string = '';
  Email: string = '';
  FirstName: string = '';
  LastName: string = '';
  MobileCode: string = '';
  Region: string = '';
  SegmentId: string = '';
  SuccessWithdrawalPaymentSystem: string = '';
  isInputFocused: string | null = null;
  previousState: any;
  showBasicInfo = false;
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
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<AddSegmentComponent>,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    private configService: ConfigService,
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
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
    this.clientStates = this.data.ClientStates.map((item, index) => {
      item.Name = item.Name.split(" ").join("");
      item.checked = false;

      // Use index to get the corresponding icon
      item.icon = UserIconMap[index];

      return item;
    });
    this.setForm();
    if (this.formGroup.valid) {
      this.previousState = { ...this.formGroup.getRawValue() }
    }
    this.getSegmentsCurrentValue();
    this.Mode = 'Dynamic';
    this.Status = 'Active';
    this.GenderName = 'All';
    this.KYCVerifiedName = 'All';
    this.EmailVerifiedName = 'All';
    this.MobileNumberVerifiedName = 'All';
  }


  private updatePropertyFromValue(controlName: string, array: any[], property: string) {
    this.formGroup.get(controlName)?.valueChanges.subscribe((value) => {
      if (value == null) {
        this[property] = 'All';
      } else {
        const selectedItem = array.find(item => item.Id === value);
        this[property] = selectedItem ? selectedItem.Name : 'All';
      }
    });
  }

  updateInputValue(controlName: string, property: string) {
    this.formGroup.get(controlName)?.valueChanges.subscribe((value) => {
      this[property] = value;
    });
  }

  getSegmentsCurrentValue() {
    this.updatePropertyFromValue('PartnerId', this.partners, 'PartnerName');
    this.updatePropertyFromValue('Mode', this.modes, 'Mode');
    this.updatePropertyFromValue('State', this.statuses, 'Status');
    this.updatePropertyFromValue('Gender', this.genders, 'GenderName');
    this.updatePropertyFromValue('IsKYCVerified', this.commonStates, 'KYCVerifiedName');
    this.updatePropertyFromValue('IsEmailVerified', this.commonStates, 'EmailVerifiedName');
    this.updatePropertyFromValue('IsMobileNumberVerified', this.commonStates, 'MobileNumberVerifiedName');
    this.updateInputValue('Name', 'Name');
    this.updateInputValue('AffiliateId', 'AffiliateId');
    this.updateInputValue('ClientId', 'ClientId');
    this.updateInputValue('SuccessDepositPaymentSystem', 'SuccessDepositPaymentSystem');
    this.updateInputValue('Email', 'Email');
    this.updateInputValue('FirstName', 'FirstName');
    this.updateInputValue('LastName', 'LastName');
    this.updateInputValue('MobileCode', 'MobileCode');
    this.updateInputValue('Region', 'Region');
    this.updateInputValue('SegmentId', 'SegmentId');
    this.updateInputValue('SuccessWithdrawalPaymentSystem', 'SuccessWithdrawalPaymentSystem');
  }


  get errorControl() {
    return this.formGroup.controls;
  }

  onSetStatusNames(event) {
    this.StatusName = event.value.map((item) => {
      const foundState = this.clientStates.find((el) => el.Id === item);
      return foundState ? " " + foundState.Name : '';
    }).filter(name => name);
  }
     


  close() {
    this.dialogRef.close();
    this.showReview.set(false);
  }

  private setForm() {
    this.formGroup = this.fb.group({
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
      AffiliateId: [null, [numbersAndCommas]],
      SuccessDepositPaymentSystem: [null, [numbersAndCommas]],
      Email: [null, [emailsWithCommasValidator]],
      FirstName: [null, [stringAndCommaValidator]],
      LastName: [null, [stringAndCommaValidator]],
      MobileCode: [null, Validators.pattern(/^\+?\d+(\s*,\s*\+?\d+)*$/)],
      Region: [null, [numbersAndCommas]],
      SegmentId: [null, [numbersAndCommas]],
      SuccessWithdrawalPaymentSystem: [null, [numbersAndCommas]],
    })
  }

  addCondition(item) {
    if (item.selectedConditionType) {
      item.conditions.push({ ConditionType: item.selectedConditionType, ConditionValue: item.selectedConditionValue });
      item.selectedConditionType = null;
      item.selectedConditionValue = new Date();
      item.showNew = false;
    }
  };

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

  onSubmit() {
    if (!this.formGroup.valid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    this.isSendingRequest = true;
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
        this.isSendingRequest = false;
      });
  }

  toggleShowMore() {
    this.showMore.set(!this.showMore());
  }

  toggleShowReview() {
    this.showReview.set(true);
  }

  toggleEdit() {
    this.getSegmentsCurrentValue();
    this.showReview.set(false);
    this.showMore.set(true);
  }

  toggleInput(field: string, state: boolean) {
    this.isInputFocused = state ? field : null;
  }
  /*cancel(field: string, state: boolean){
    this.formGroup.reset(this.previousState);
    this.isInputFocused = state ? field : null;
  }*/
  protected readonly input = input;
}
