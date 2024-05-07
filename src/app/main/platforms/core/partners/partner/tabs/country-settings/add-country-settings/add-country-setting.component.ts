import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {CoreApiService} from "../../../../../services/core-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommonDataService, ConfigService} from "../../../../../../../../core/services";
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Controllers, Methods} from "../../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ServerCommonModel } from 'src/app/core/models/server-common-model';
import { COUNTRY_STATUSES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-add-country-setting',
  templateUrl: './add-country-setting.component.html',
  styleUrls: ['./add-country-setting.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    TranslateModule,
    MatDialogModule,
  ]
})
export class AddCountrySettingComponent implements OnInit {
  formGroup: UntypedFormGroup;
  currencies = [];
  paymentSetting;
  countries: ServerCommonModel[] = [];
  statuses = COUNTRY_STATUSES;
  isSendingReqest = false; 

  constructor(public dialogRef: MatDialogRef<AddCountrySettingComponent>,
              private apiService: CoreApiService,
              private _snackBar: MatSnackBar,
              public configService: ConfigService,
              private fb: UntypedFormBuilder,
              public commonDataService: CommonDataService,
              @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit(): void {
    this.getCountry();
    this.formValues();

  }

  getCountry() {
    this.apiService.apiPost(this.configService.getApiUrl, {TypeId: 5}, true,
      Controllers.REGION, Methods.GET_REGIONS).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.countries = data.ResponseObject;
      }
    });
  }

  private formValues() {
    this.formGroup = this.fb.group({
      RegionId: [null,[Validators.required]],
      Type: [null,[Validators.required]],
      PartnerId: [this.data.partnerId],
    })
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    const setting = this.formGroup.getRawValue();
    this.isSendingReqest = true; 
    this.apiService.apiPost(this.configService.getApiUrl, setting, true,
      Controllers.PARTNER, Methods.SAVE_PARTNER_COUNTRY_SETTING).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
      this.isSendingReqest = false; 
    });
  }

}
