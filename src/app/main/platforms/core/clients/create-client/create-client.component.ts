import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from "@angular/common";

import { DateAdapter } from "@angular/material/core";
import { debounceTime, filter, take } from "rxjs/operators";
import { TranslateModule } from "@ngx-translate/core";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, } from "@angular/material/snack-bar";

import {
  UntypedFormBuilder,
  UntypedFormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors
} from "@angular/forms";
import { CommonDataService, ConfigService } from "../../../../../core/services";
import { Controllers, Methods } from "../../../../../core/enums";
import { ServerCommonModel } from 'src/app/core/models/server-common-model';
import { CoreApiService } from '../../services/core-api.service';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { CustomSelectComponent } from 'src/app/main/components/custom-select/custom-select.component';
import { MobileNumberRegComponent } from "../../../../components/mobile-number/mobile-number.component";
import { BirthDateComponent } from "../../../../components/birth-date/birth-date.component";
import { RegionComponent } from "../../../../components/region/region.component";

@Component({
  standalone: true,
  selector: 'app-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    FormsModule,
    MatDialogModule,
    CustomSelectComponent,
    MobileNumberRegComponent,
    BirthDateComponent,
    RegionComponent
  ],
})
export class CreateClientComponent implements OnInit {
  formGroup: UntypedFormGroup;
  items: WritableSignal<any[]> = signal([]);
  partners: WritableSignal<any[]> = signal([]);
  partnerId: number = 0;
  jobAreas: WritableSignal<ServerCommonModel[]> = signal([]);
  partnerCurrencies: WritableSignal<any[]> = signal([]);
  isSendingRequest = false;
  showPassword = false;
  passwordDosnetMutch: WritableSignal<boolean> = signal(false);
  minDate: Date;
  private isProgrammaticUpdate = false;

  constructor(private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<CreateClientComponent>,
    public commonDataService: CommonDataService,
    private configService: ConfigService,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    this.initForm();
    this.setMinDate();
    this.partners.set(this.commonDataService.partners);
  }

  setMinDate() {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 18);
    this.minDate = currentDate;
  }

  initForm() {
    this.formGroup = this.fb.group({
      PartnerId: [null],
    }, { updateOn: 'change' });
  }

  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  onPartnerChange(val: number) {
    this.formGroup.reset({
      PartnerId: val,
    });
    this.items.set([]);
    this.partnerId = val;
    this.apiService.apiPost(
      this.configService.getApiUrl,
      { PartnerId: val, DeviceType: 1 },
      true, Controllers.PARTNER, Methods.GET_CLIENT_REGISTRATION_FIELDS
    ).subscribe(data => {
      if (data.ResponseCode === 0) {
        const responseData = data.ResponseObject;
        responseData.sort((a, b) => a.Order - b.Order);
        const transformedItems = this.transformFields(responseData);
        this.items.set(transformedItems.fields);
        this.createForm();
        if (this.items().some(item => item.Type === 'JobArea')) {
          this.getJobAreas();
        }
        this.getPartnerCurrencySettings();
      } else {
        // Handle API error
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }



  transformFields(subMenuItems: any[]): { fields: any[] } {
    const fields = subMenuItems.map(item => {
      const href = JSON.parse(item.Href);
      const field = {
        Title: item.Title,
        Type: item.Type,
        Required: href.mandatory === '1',
        InputType: item.Title === 'Password' ? 'password' : 'text',
        RegExp: href.regExp ? new RegExp(href.regExp) : null
      };
      return field;
    });
    return { fields };
  }

  getPartnerCurrencySettings() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.partnerId, true,
      Controllers.CURRENCY, Methods.GET_PARTNER_CURRENCY_SETTINGS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.partnerCurrencies.set(data.ResponseObject.partnerCurrencies);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  createForm() {
    this.items().forEach(item => {
      const validators = [];
      if (item.Required) {
        if (item.Type === 'checkbox') {
          validators.push(Validators.requiredTrue);
        } else {
          validators.push(Validators.required);
        }
      }
      if (item.RegExp) {
        validators.push(Validators.pattern(item.RegExp));
      }
      this.formGroup.addControl(item.Title, this.fb.control('', validators));
    });

    if (this.formGroup.get('Password')) {
      this.formGroup.addControl('Password', this.fb.control('', Validators.required));
      this.formGroup.addControl('confirmPassword', this.fb.control('', [Validators.required, this.passwordMatchValidator()]));
    }
  }

  private getJobAreas() {
    if (this.jobAreas.length > 0) {
      return;
    }
    this.apiService.apiPost(this.configService.getApiUrl,
      null, true, Controllers.CONTENT, Methods.GET_JOB_AREA).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.jobAreas = data.ResponseObject;
        }
      });
  }

  onSubmit() {
    const requestData = this.formGroup.getRawValue();
    this.isSendingRequest = true;
    requestData['Gender'] = requestData['Gender'] == '' ? 0 : requestData['Gender'];
    requestData['PartnerId'] = this.partnerId;

    if (requestData['MobileNumber']) {
      requestData['MobileNumber'] = requestData['MobileCode'] + requestData['MobileNumber'];
    }

    if (requestData['BirthDay']) {
      requestData['BirthDate'] = requestData['BirthDay'];
      delete requestData['BirthDay'];
    }


    this.apiService.apiPost(this.configService.getApiUrl, requestData,
      true, Controllers.CLIENT, Methods.REGISTER_CLIENT).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingRequest = false;
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  updateErrorMessage() {
    const password = this.formGroup.get('Password')?.value;
    const confirmPassword = this.formGroup.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      this.formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      this.passwordDosnetMutch.set(false);
    }
  }

  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('Password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  isRequired(controlName: string): boolean {
    const control = this.formGroup.get(controlName);
    if (control?.validator) {
      const validator = control.validator({} as AbstractControl) as ValidationErrors;
      return !!validator?.required;
    }
    return false;
  }

  subscribeToFormChanges() {
    this.formGroup.valueChanges
      .pipe(
        debounceTime(300),
        filter(() => !this.isProgrammaticUpdate)

      )
      .subscribe(() => {
        this.checkFormValidation();
      });
  }

  checkFormValidation() {
    this.isProgrammaticUpdate = true;
    Object.keys(this.formGroup.controls).forEach(key => {
      const control = this.formGroup.get(key);
      if (control) {
        control.updateValueAndValidity();
      }
    });

    this.formGroup.updateValueAndValidity();

    this.isProgrammaticUpdate = false;
  }


}
