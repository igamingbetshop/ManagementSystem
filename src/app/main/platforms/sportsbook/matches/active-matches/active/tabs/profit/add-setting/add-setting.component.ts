import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfigService} from "../../../../../../../../../core/services";
import {ActivatedRoute} from "@angular/router";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {SportsbookApiService} from "../../../../../../services/sportsbook-api.service";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-add-setting',
  templateUrl: './add-setting.component.html',
  styleUrls: ['./add-setting.component.scss']
})
export class AddSettingComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  public marketTypes = [];

  constructor(public dialogRef: MatDialogRef<AddSettingComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { PartnerId: any, MatchId: any },
              private _snackBar: MatSnackBar,
              private apiService: SportsbookApiService,
              public configService: ConfigService,
              private activateRoute: ActivatedRoute,
              private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.getMarketTypes();
    this.formValues();
  }

  formValues() {
    this.formGroup = this.fb.group({
      PartnerId: [this.data.PartnerId],
      MatchId: [this.data.MatchId],
      MarketTypeId: [null, [Validators.required]],
      AbsoluteProfitRange1: [null, [Validators.required]],
      AbsoluteProfitRange2: [null, [Validators.required]],
      AbsoluteProfitRange3: [null, [Validators.required]],
      RelativeLimitRange1: [null, [Validators.required]],
      RelativeLimitRange2: [null, [Validators.required]],
      RelativeLimitRange3: [null, [Validators.required]],
      RelativeLimitLive: [null, [Validators.required]],
      AbsoluteProfitLive: [null, [Validators.required]],
      AllowMultipleBets: [false],
    });
  }

  getMarketTypes() {
    this.apiService.apiPost('markettypes', {
      pageindex: 0,
      pagesize: 500,
      ApiOperationTypeList: [
        {IntValue: "1", OperationTypeId: 1},
      ]
    })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.marketTypes = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });
  }

  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  submit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost('matches/createmarkettypeprofit', obj)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });

  }

}
