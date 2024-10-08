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
  markets: any[] = [];
  selections: any[] = [];
  marketTypeGroups: any[] = [];
  marketTypesGroupIds: number[] = [];
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
          this.marketTypeGroups.unshift({
            Id: null,
            Name: 'All'
          });

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      });
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
    this.onSelectedMarketEmit.emit(this.marketTypeGroups[index]);
  }


}

