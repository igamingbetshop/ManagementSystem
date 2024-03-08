import {Component, Inject, OnInit} from '@angular/core';
import {take} from "rxjs/operators";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SportsbookApiService} from "../../../../../../services/sportsbook-api.service";
import {ConfigService} from "../../../../../../../../../core/services";
import {ActivatedRoute} from "@angular/router";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {SnackBarHelper} from "../../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-add-market',
  templateUrl: './add-market.component.html',
  styleUrls: ['./add-market.component.scss']
})
export class AddMarketComponent implements OnInit {
  public markets = [];
  public selections = [];
  public formGroup: UntypedFormGroup;
  public sportId;
  public selectedMarket;

  constructor(
    public dialogRef: MatDialogRef<AddMarketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { PartnerId: any, MatchId: any },
    private _snackBar: MatSnackBar,
    private apiService: SportsbookApiService,
    public configService: ConfigService,
    private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.sportId = +this.activateRoute.snapshot.queryParams.sportId;
    this.getMarkets();
    // this.formValues();
  }

  formValues() {
    this.formGroup = this.fb.group({
      MatchId: [this.data.MatchId],
      TypeId: [null, [Validators.required]],
      // PointSequence: [null],
      // Sequence: [null],
      // GameSequence: [null],
    });
  }


  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  getMarkets() {
    this.apiService.apiPost('markettypes', {
      SportIds: {
        IsAnd: true,
        ApiOperationTypeList: [{IntValue: this.sportId, OperationTypeId: 1}]
      }
    })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.markets = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      })
  }

  submit() {
    // if (this.formGroup.invalid) {
    //   return;
    // }
    // const obj = this.formGroup.getRawValue();
    // console.log(obj);

    let obj2 = {
      MatchId: this.data.MatchId,
      TypeId: this.selectedMarket,
      Selections: this.selections
    }
    this.apiService.apiPost('markets/createmarket', obj2)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }


  getSelections() {
    this.apiService.apiPost('markettypes/selectiontypes', {
      MarketTypeId: this.selectedMarket
    })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          // this.selections = data.Selections;
          let selections = data.Selections;
          this.setFormFields(selections);
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      })
  }

  setFormFields(selections) {
    selections.forEach((item) => {
      // console.log(item);
      let obj = {};
      // CalculationFormula: "t1>t2?2:3\r\n"
      // CalculationTime: "cf=1"
      // Coefficient: "23"
      // HighValue: "3"
      // Id: 1
      // LowValue: "23"
      // MarketTypeId: 1
      // Name: "{t1}"
      // Priority: 1
      // TeamId: "321"
      // TranslationId: 60671
      obj['Id'] = item.Id;
      obj['MarketTypeId'] = item.MarketTypeId;
      obj['TranslationId'] = item.TranslationId;
      obj['Name'] = item.Name;
      obj['Priority'] = item.Priority;
      obj['TeamId'] = item.TeamId;
      obj['CalculationFormula'] = item.CalculationFormula;
      obj['CalculationTime'] = item.CalculationTime;
      obj['Coefficient'] = item.Coefficient;
      obj['HighValue'] = item.HighValue;
      obj['LowValue'] = item.LowValue;


      this.selections.push(obj);
    })
  }

  selectedMarketType(event) {
    this.selectedMarket = event;
    this.getSelections();
  }

}
