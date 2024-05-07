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
import {MatSnackBar} from '@angular/material/snack-bar';
import {take} from 'rxjs/operators';
import {CoreApiService} from '../../../services/core-api.service';
import {CommonDataService, ConfigService} from 'src/app/core/services';
import {Controllers, Methods} from 'src/app/core/enums';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DateAdapter, MatNativeDateModule} from '@angular/material/core';
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";


@Component({
  selector: 'app-crm-settings-currency',
  templateUrl: './add-settings.component.html',
  styleUrls: ['./add-settings.component.scss'],
  standalone: true,
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
    MatNativeDateModule,
    MatDialogModule
  ],
})
export class AddSettingsComponent implements OnInit {
  formGroup: UntypedFormGroup;
  partners: any[] = [];
  settingTypes: any[] = [];
  isSendingReqest = false; 

  constructor(
    public dialogRef: MatDialogRef<AddSettingsComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private configService: ConfigService,
    public commonDataService: CommonDataService,
    public dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_CRM_SETTINGS_TYPES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.settingTypes = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }

      })
    this.partners = this.commonDataService.partners;
    this.createForm();
  }

  public createForm() {
    this.formGroup = this.fb.group({
      NickeName: [null, [Validators.required]],
      PartnerId: [null, [Validators.required]],
      Type: [null, [Validators.required]],
      State: [false],
      StartTime: [new Date],
      FinishTime: [new Date],
      Period: [null],
      Sequence: [null],
      Condition: [null],
    });
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
    if (obj.State === false) {
      obj.State = 0;
    } else {
      obj.State = 1;
    }
    this.apiService.apiPost(this.configService.getApiUrl, obj,
      true, Controllers.CONTENT, Methods.SAVE_CRM_SETTINGS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
        this.isSendingReqest = false;
      })
  }
}