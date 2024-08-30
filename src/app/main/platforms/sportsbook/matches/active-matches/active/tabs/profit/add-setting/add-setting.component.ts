import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConfigService } from "../../../../../../../../../core/services";
import { ActivatedRoute } from "@angular/router";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { SportsbookApiService } from "../../../../../../services/sportsbook-api.service";
import { take } from "rxjs/operators";
import { SnackBarHelper } from "../../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-add-setting',
  templateUrl: './add-setting.component.html',
  styleUrls: ['./add-setting.component.scss']
})
export class AddSettingComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  public marketTypes = [];
  public sportId: number;
  public categoryId: number;
  public competitionId: number;

  constructor(public dialogRef: MatDialogRef<AddSettingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { PartnerId: any, MatchId: any, Method: string, marketTypeIds: number[],   },
    private _snackBar: MatSnackBar,
    private apiService: SportsbookApiService,
    public configService: ConfigService,
    private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.sportId = +this.activateRoute.snapshot.queryParams.sportId;
    this.categoryId = +this.activateRoute.snapshot.queryParams.categoryId;
    this.competitionId = +this.activateRoute.snapshot.queryParams.competitionId;
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
      AllowMultipleBets: [false],
      AbsoluteProfitLiveRange1: [null, [Validators.required]],
      AbsoluteProfitLiveRange2: [null, [Validators.required]],
      AbsoluteProfitLiveRange3: [null, [Validators.required]],
      AbsoluteProfitLiveRange4: [null, [Validators.required]],
      AbsoluteProfitLiveRange5: [null, [Validators.required]],
      AbsoluteProfitLiveRange6: [null, [Validators.required]],
    });

  }

   getMarketTypes() {
      const filterRequest = {
        SportIds: {
          ApiOperationTypeList: [{
            IntValue: this.sportId,
            OperationTypeId: 1
          }]
        }, pageindex: 0, pagesize: 500
      };
  
      this.apiService.apiPost('markettypes', filterRequest)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.marketTypes = data.ResponseObject;

          if(!!this.data?.marketTypeIds?.length) {
            const filteredResponse = data.ResponseObject.filter(data => !this.data.marketTypeIds.includes(data.Id));
            this.marketTypes = filteredResponse.map(el => {
              return { Id: el.Id, Name: `${el.Name} - ${el.Id}` };
            });
          } else {
            this.marketTypes = data.ResponseObject.map(el => {
              return {Id: el.Id, Name: `${el.Name} - ${el.Id}`};
            });
          }
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
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

    obj.CompetitionCategoryId = this.categoryId ? this.categoryId : null;
    obj.CompetitionId = this.competitionId ? this.competitionId : null;

    this.apiService.apiPost(this.data.Method, obj)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });

  }

}
