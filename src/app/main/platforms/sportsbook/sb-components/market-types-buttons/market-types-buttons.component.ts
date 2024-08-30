import { Component,OnInit, inject, input, output } from '@angular/core';
import { take } from "rxjs/operators";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { ConfigService } from 'src/app/core/services';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-market-types-buttons',
  templateUrl: './market-types-buttons.component.html',
  styleUrls: ['./market-types-buttons.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule,
    TranslateModule,
  ]
})
export class MarketTypesButtonsComponent implements OnInit {
  markets = [];
  selections = [];
  marketTypeGroups = [];
  marketTypes = [];
  marketTypesGroupIds: number[];
  labelForMarketTypes: any[] = [];
  activeIndex: number | null = null;
  partnerId = input<number>();
  sportId = input<number>();
  matchId = input<number>();
  onSelectedMarketEmit = output<any>();

  apiService = inject(SportsbookApiService);
  configService = inject(ConfigService);
  activateRoute = inject(ActivatedRoute);
  _snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.getMarkets();
    this.getMarketTypesGroups();
  }

  getMarketTypesGroups() {
    const requestData = {
      SportIds: {
        IsAnd: true,
        ApiOperationTypeList: [{ IntValue: this.sportId(), OperationTypeId: 1 }]
      }
    };

    this.apiService.apiPost('markettypes/groups', requestData)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.marketTypeGroups = data.ResponseObject;
          this.getBuildMarketTypes();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      });
  }

  getMarketTypeSelections(market, index) {
    const requestData = {
      MatchId: this.matchId(),
      MarketTypeId: market.I,
      TeamId: market.TI || null
    };

    this.apiService.apiPost('markets/markettypeselections', requestData)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.selections = data.ResponseObject;
          console.log(this.selections, 'selections');
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      });
  }

  getBuildMarketTypes() {
    const requestData = {
      MatchId: this.matchId(),
      SportId: this.sportId()
    };

    this.apiService.apiPost('markettypes/buildermarkettypes', requestData)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.marketTypes = data.ResponseObject.SMT[0].MTs;
          this.setGroupTypes();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      });
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
    // console.log(this.marketTypesGroupIds, "this.marketTypesGroupIds");
    
    this.setLabelForMarketTypes();
  }

  setLabelForMarketTypes() {
    this.labelForMarketTypes = this.marketTypeGroups.filter(group =>
      this.marketTypesGroupIds.includes(group.Id)
    ) || [];
    this.labelForMarketTypes.unshift({
      Id: null,
      Name: 'All'
    });
    console.log(this.labelForMarketTypes, "this.labelForMarketTypes" );
    
    this.activeIndex = 0;
  }

  getMarkets() {
    const requestData = {
      SportIds: {
        IsAnd: true,
        ApiOperationTypeList: [{ IntValue: this.sportId(), OperationTypeId: 1 }]
      }
    };

    this.apiService.apiPost('markettypes', requestData)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.markets = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      });
  }

  onSelectMarket(item: any, index: number): void {
    this.activeIndex = index;
    this.onSelectedMarketEmit.emit(this.labelForMarketTypes[index]);
  }
}