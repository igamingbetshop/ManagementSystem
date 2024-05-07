import {CommonModule} from '@angular/common';
import {Component, NgModule, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';

import {MatFormFieldModule} from '@angular/material/form-field';

import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';

import {MatSelectModule} from '@angular/material/select';
import {TranslateModule} from "@ngx-translate/core";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {CommonDataService, ConfigService} from 'src/app/core/services';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Controllers, Methods} from 'src/app/core/enums';
import {take} from 'rxjs/operators';
import {CoreApiService} from '../../services/core-api.service';
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
})
export class CreateUserComponent implements OnInit {
  formGroup: UntypedFormGroup;
  partners: any[] = [];
  types: any[] = [];
  states: any[] = [];
  currencies: any[] = [];
  genders: any[] = [];
  languages: any[] = [];
  passRegEx;
  partnerId;
  typeId;
  isSendingReqest = false; 

  constructor(
    public dialogRef: MatDialogRef<CreateUserComponent>,
    public commonDataService: CommonDataService,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private configService: ConfigService,
  ) {
  }

  ngOnInit() {
    this.initialStates();
    this.initialTypes();
    this.genders = this.commonDataService.genders;
    this.currencies = this.commonDataService.currencies;
    this.partners = this.commonDataService.partners;
    this.languages = this.commonDataService.languages;
    this.createForm();
  }

  getPartnerId(event) {
    event.value = this.formGroup.get('PartnerId').value;
    this.partnerId = this.formGroup.get('PartnerId').value;
    if (this.partnerId && this.typeId) {
      this.getPasswordRegex();
    }
  }

  getTypeId(event) {
    event.value = this.formGroup.get('Type').value;
    this.typeId = this.formGroup.get('Type').value;
    if (this.partnerId && this.typeId) {
      this.getPasswordRegex();
    }
  }

  public getPasswordRegex() {
    this.apiService.apiPost(this.configService.getApiUrl, {PartnerId: this.partnerId, Type: this.typeId},
      true, Controllers.PARTNER, Methods.GET_USER_PASSWORD_REGEX).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {

        this.passRegEx = data.ResponseObject;
        let reg = new RegExp(this.passRegEx);
        this.formGroup.controls["Password"].setValidators([Validators.pattern(reg), Validators.minLength(8), Validators.required]);
        this.formGroup.controls['Password'].updateValueAndValidity();
        this.formGroup.controls['Password'].enable();
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }


  public initialStates() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_USER_STATES_ENUM).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.states = data.ResponseObject.filter(element => element.Id <= 4);
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  public initialTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_USER_TYPES_ENUM).pipe(take(1)).subscribe(data => {

      if (data.ResponseCode === 0) {
        this.types = data.ResponseObject;

      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  public createForm() {
    this.formGroup = this.fb.group({
      PartnerId: [null, [Validators.required]],
      Type: [null, [Validators.required]],
      State: [null, [Validators.required]],
      UserName: [null, [Validators.required]],
      FirstName: [null, [Validators.required]],
      Password: [null],
      LastName: [null, [Validators.required]],
      CurrencyId: [null, [Validators.required]],
      Email: [null],
      Gender: [1],
      LanguageId: [null, [Validators.required]],   //  /(?=^.{1,10}$)[a-zA-Z0-9](?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/
    });
    this.formGroup.controls['Password'].disable();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  close() {
    this.dialogRef.close();
  }


  onSubmit() {
    if (this.formGroup.invalid || this.isSendingReqest) {
      return;
    }
    this.isSendingReqest = true; 
    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost(this.configService.getApiUrl, obj,
      true, Controllers.USER, Methods.SAVE_USER).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
      this.isSendingReqest = false;
    });
  }
}
