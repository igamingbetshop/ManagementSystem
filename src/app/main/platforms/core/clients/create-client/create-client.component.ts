import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";

import { DateAdapter } from "@angular/material/core";
import { take } from "rxjs/operators";
import { TranslateModule } from "@ngx-translate/core";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, } from "@angular/material/snack-bar";

import {
  AbstractControlOptions,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule
} from "@angular/forms";
import { CommonDataService, ConfigService } from "../../../../../core/services";
import { Controllers, Methods } from "../../../../../core/enums";
import { ServerCommonModel } from 'src/app/core/models/server-common-model';
import { Validator } from '../../../../../core/validator';
import { CoreApiService } from '../../services/core-api.service';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";

@Component({
  standalone: true,
  selector: 'app-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss'],
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
    MatDialogModule
  ],
})
export class CreateClientComponent implements OnInit {
  formGroup: UntypedFormGroup;
  items: any[] = [];
  partners: any[] = [];
  selectedCities: any[] = [];
  partnerId: number = 0;
  countries: ServerCommonModel[] = [];
  private allCities: ServerCommonModel[] = [];
  clientStates: ServerCommonModel[] = [];
  clientCategories: ServerCommonModel[] = [];
  jobAreas: ServerCommonModel[] = [];
  partnerCurrencies = [];
  titles = [];
  isSendingReqest = false;

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
    this.formGroup = this.fb.group({
      PartnerId: [null],
      SendMail: [false],
      SendSms: [false],
      IsAffiliateManager: [false],
    }, {
      Validators: Validator.MatchPassword
    } as AbstractControlOptions);
    this.partners = this.commonDataService.partners;
    this.getRegions();
    this.getJobAreas();

  }

  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  onPartnerChange(val: number) {
    this.formGroup.reset();
    this.formGroup.get('PartnerId').setValue(val);
    this.formGroup.get('SendMail').setValue(false);
    this.formGroup.get('SendSms').setValue(false);
    this.formGroup.get('IsAffiliateManager').setValue(false);
    this.items = [];
    this.partnerId = val;
    this.apiService.apiPost(this.configService.getApiUrl, {PartnerId: val, DeviceType: 1},
      true, Controllers.CONTENT, Methods.GET_WEBSITE_MENU).subscribe(data => {
        if (data.ResponseCode === 0) {
          let menus = data.ResponseObject;
          let menuId = menus.find(menu => {

            return menu['Type'] == 'Config'
          })?.Id;
          this.getWebSiteMenuItems(menuId);
          this.getPartnerCurrencySettings();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }

      })
  }

  getPartnerCurrencySettings() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.partnerId, true,
      Controllers.CURRENCY, Methods.GET_PARTNER_CURRENCY_SETTINGS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.partnerCurrencies = data.ResponseObject.partnerCurrencies
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getWebSiteMenuItems(menuId) {
    this.apiService.apiPost(this.configService.getApiUrl, menuId,
      true, Controllers.CONTENT, Methods.GET_WEBSITE_MENU_ITEMS).subscribe(data => {
        if (data.ResponseCode === 0) {
          let menuItems = data.ResponseObject;
          let menuItemId = menuItems.find(menuItem => {
            return menuItem['Title'] == "FullRegister"
          }).Id;
          this.getWebSiteSubMenuItems(menuItemId);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  getWebSiteSubMenuItems(menuItemId) {
    this.apiService.apiPost(this.configService.getApiUrl, menuItemId,
      true, Controllers.CONTENT, Methods.GET_WEBSITE_SUB_MENU_ITEMS).subscribe(data => {
        if (data.ResponseCode === 0) {
          let subMenuItems = data.ResponseObject;
          this.setFormFields(subMenuItems);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  onCountryChange(id) {
    this.selectedCities = this.allCities.filter(sity => { return sity.ParentId === id });
  }

  setFormFields(subMenuItems) {
    subMenuItems.forEach((item) => {
      let obj = {};
      const href = JSON.parse(item.Href);
      obj["Required"] = !!(+href.mandatory);
      if (href.regEx) {
        const regEx = href.regEx;
        obj["regEx"] = new RegExp(regEx);
      }
      obj["Title"] = item.Title;
      obj["Type"] = item.Type;
      obj["Order"] = item.Order;
      this.items.push(obj);

      if (item.Type === 'password') {
        let obj1 = {};
        if (href.regEx) {
          const regEx = href.regEx;
          obj1["regEx"] = new RegExp(regEx);
        }
        obj1["Required"] = true;
        obj1["Title"] = 'ConfirmPassword';
        obj1["Type"] = 'confirm';
        obj1["Icon"] = '';
        this.items.push(obj1);
      }

      if (item.Type === 'MobileData') {
        let obj2 = {};
        obj2["Required"] = !!(+href.mandatory);
        obj2["Title"] = 'MobileNumber';
        obj2["Type"] = 'mobileNumber';
        obj2["Icon"] = '';
        this.items.push(obj2);
      }
    });
    this.createForm();
  }

  getTitles() {
    this.apiService.apiPost(this.configService.getApiUrl, '', true,
      Controllers.ENUMERATION, Methods.GET_CLIENT_TITLES_ENUM).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.titles = data.ResponseObject;
        }
      });
  }

  private createForm() {
    this.items.forEach(item => {
      if(item["Type"] == 'Title') {
        this.getTitles();
      }

      let control: UntypedFormControl = new UntypedFormControl('');
      if (item['Required']) {
        control.addValidators(Validators.required);
      }
      if (item['regEx']) {
        control.addValidators(Validators.pattern(item['regEx']));
      }
      let name: string = item['Title'];
      this.formGroup.addControl(name, control);
      if (item['Required'] && item['Type'] === 'checkbox') {
        this.formGroup.get(item['Title']).setValue(true);
      }
    });

    this.formGroup.addValidators(Validator.MatchPassword('Password', 'ConfirmPassword'));
    this.formGroup.get('ConfirmPassword').addValidators(Validator.MatchPassword('Password', 'ConfirmPassword'));
    this.formGroup.get('ConfirmPassword').updateValueAndValidity();
  }

  private getRegions() {
    this.apiService.apiPost(this.configService.getApiUrl, { TypeId: 5 }, true,
      Controllers.REGION, Methods.GET_REGIONS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          data.ResponseObject.forEach(r => {
            if (r.TypeId === 3)
              this.allCities.push(r);
            else if (r.TypeId === 5)
              this.countries.push(r);
          });
        }
      });
  }

  private getJobAreas() {
    this.apiService.apiPost(this.configService.getApiUrl,
      null, true, Controllers.CONTENT, Methods.GET_JOB_AREA).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.jobAreas = data.ResponseObject;
        }
      });
  }

  onSubmit() {
    const requestData = this.formGroup.getRawValue();
    this.isSendingReqest = true; 
    requestData['Gender'] = requestData['Gender'] == '' ? 0 : requestData['Gender'];
    requestData['PartnerId'] = this.partnerId;
    if(requestData['MobileNumber']) {
      requestData['MobileNumber'] = `${requestData['MobileCode']}${requestData['MobileNumber']}`
    }

    this.apiService.apiPost(this.configService.getApiUrl, requestData,
      true, Controllers.CLIENT, Methods.REGISTER_CLIENT).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false; 
      });
  }
}
