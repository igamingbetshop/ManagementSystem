import { Component, Inject, OnInit } from '@angular/core';
import { take } from "rxjs/operators";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { SportsbookApiService } from "../../../../../../services/sportsbook-api.service";
import { ConfigService } from "../../../../../../../../../core/services";
import { ActivatedRoute } from "@angular/router";
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { SnackBarHelper } from "../../../../../../../../../core/helpers/snackbar.helper";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CdkAccordionModule } from '@angular/cdk/accordion';

import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-build-market',
  templateUrl: './build-market.component.html',
  styleUrls: ['./build-market.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    TranslateModule,
    MatTabsModule,
    CdkAccordionModule,
  ]
})
export class BuildMarketComponent implements OnInit {
  public markets = [];
  public selections = [];
  public formGroup: UntypedFormGroup;
  public sportId;
  public selectedMarket;
  marketTypeGroupes = [];
  marketTypes = [];
  marketTypesGroupIds: number[];
  LabelForMarketTypes: any = [];
  selectedLabelIndex: number = 0;
  dysplayMarkets: any[];
  selectedLabel: string;
  betSelections = []
  selectedMarkets = [];

  constructor(
    public dialogRef: MatDialogRef<BuildMarketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { PartnerId: any, MatchId: any },
    private _snackBar: MatSnackBar,
    private apiService: SportsbookApiService,
    public configService: ConfigService,
    public activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.sportId = +this.activateRoute.snapshot.queryParams.sportId;
    this.getMarkets();
    this.getMarketTypesGroups();
    // this.formValues();
  }

  getMarketTypesGroups() {
    this.apiService.apiPost('markettypes/groups', {
      SportIds: {
        IsAnd: true,
        ApiOperationTypeList: [{ IntValue: this.sportId, OperationTypeId: 1 }]
      }
    })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.marketTypeGroupes = data.ResponseObject;
          this.getBuildMarketTypes();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  getMarketTypeSelections(market, index) {
    console.log(market, "market", index);
    const data = {
      MatchId: this.data.MatchId,
      MarketTypeId: market.I,
      TeamId:  market.TI || null

    }
    const id = market.I;
    this.apiService.apiPost('markets/markettypeselections', data)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.selections = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  toggleSelection(market: any): void {
      if (this.selectedMarkets.length < 2) {
        this.selectedMarkets.push(market);
      } else {
        market.selected = false;
        SnackBarHelper.show(this._snackBar, { Description: 'You can only select up to 2 markets.', Type: "error" });
      }
  }

  getBuildMarketTypes() {
    this.apiService.apiPost('markettypes/buildermarkettypes', {
      MatchId: this.data.MatchId,
      SportId: this.sportId
    })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.marketTypes = data.ResponseObject.SMT[0].MTs;
          this.setGroupTypes();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  setGroupTypes() {
    const uniqueGIs: number[] = [];

    this.marketTypes.forEach((betType) => {
      betType.GIs.forEach((gi) => {
        if (!uniqueGIs.includes(gi)) {
          uniqueGIs.push(gi);
        }
      });
    });
    this.marketTypesGroupIds = uniqueGIs;

    this.setLabelForMarketTypes();
  }

  setLabelForMarketTypes() {
    this.LabelForMarketTypes = this.marketTypeGroupes?.filter(group =>
      this.marketTypesGroupIds.includes(group.Id)
    ) || [];
  
    if (this.LabelForMarketTypes.length > 0) {
      this.selectedLabel = this.LabelForMarketTypes[0].Name;
      this.getFilteredMarketTypes();
    }
  }
  


  close() {
    this.dialogRef.close();
  }

  getMarkets() {
    this.apiService.apiPost('markettypes', {
      SportIds: {
        IsAnd: true,
        ApiOperationTypeList: [{ IntValue: this.sportId, OperationTypeId: 1 }]
      }
    })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.markets = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  submit() {
    console.log(this.marketTypes, "marketTypes");
    // if (this.formGroup.invalid) {
    //   return;
    // }
    // const obj = this.formGroup.getRawValue();
    // console.log(obj);

    // let obj2 = {
    //   MatchId: this.data.MatchId,
    //   TypeId: this.selectedMarket,
    //   Selections: this.selections
    // }
    // this.apiService.apiPost('markets/createmarket', obj2)
    //   .pipe(take(1))
    //   .subscribe(data => {
    //     if (data.Code === 0) {
    //       this.dialogRef.close(data.ResponseObject);
    //     } else {
    //       SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
    //     }
    //   });
  }

  getFilteredMarketTypes() {
    this.dysplayMarkets = this.marketTypes.filter(market => market.GIs.includes(this.LabelForMarketTypes[this.selectedLabelIndex ].Id));
  }

  // Function to handle tab selection and update the selectedLabelIndex 
  selectLabel(label: any, name: string): void {
    this.selectedLabelIndex  = label;
    this.selectedLabel = name;
    this.getFilteredMarketTypes();
  }

}
