import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommonDataService, ConfigService} from "../../../../../../../core/services";
import {CoreApiService} from "../../../../services/core-api.service";
import {ActivatedRoute} from "@angular/router";
import {Controllers, Methods} from "../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public segment;
  public isEdit = false;
  public segmentId;
  public formGroup: UntypedFormGroup;

  constructor(private _snackBar: MatSnackBar,
              public commonDataService: CommonDataService,
              private configService: ConfigService,
              private apiService: CoreApiService,
              private activateRoute: ActivatedRoute,
              private fb: UntypedFormBuilder,) {
  }

  ngOnInit() {
    this.segmentId = +this.activateRoute.snapshot.queryParams.segmentId;
    this.formValues();
    this.getSegmentSettings();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    obj.SegmentId = this.segmentId;
    this.apiService.apiPost(this.configService.getApiUrl, obj,
      true, Controllers.CONTENT, Methods.SAVE_SEGMENT_SETTING).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.isEdit = false;
        this.getSegmentSettings();
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  formValues() {
    this.formGroup = this.fb.group({
      CreationTime: [{value: null, disabled: true}],
      LastUpdateTime: [{value: null, disabled: true}],
      Priority: [null],
      WithdrawMaxAmount: [null],
      WithdrawMinAmount: [null],
      DepositMaxAmount: [null],
      DepositMinAmount: [null],
      AlternativeDomain: [null],
    });
  }

  getSegmentSettings() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.CONTENT, Methods.GET_SEGMENTS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.segment = data.ResponseObject[0].SegementSetting;
          this.formGroup.get('CreationTime').setValue(this.segment['CreationTime']);
          this.formGroup.get('LastUpdateTime').setValue(this.segment['LastUpdateTime']);
          this.formGroup.get('Priority').setValue(this.segment['Priority']);
          this.formGroup.get('WithdrawMaxAmount').setValue(this.segment['WithdrawMaxAmount']);
          this.formGroup.get('WithdrawMinAmount').setValue(this.segment['WithdrawMinAmount']);
          this.formGroup.get('DepositMaxAmount').setValue(this.segment['DepositMaxAmount']);
          this.formGroup.get('DepositMinAmount').setValue(this.segment['DepositMinAmount']);
          this.formGroup.get('AlternativeDomain').setValue(this.segment['AlternativeDomain']);
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });
  }

}
