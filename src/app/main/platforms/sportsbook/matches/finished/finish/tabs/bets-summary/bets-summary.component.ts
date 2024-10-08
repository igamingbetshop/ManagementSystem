import { Component, Injector, OnInit } from '@angular/core';
import { SportsbookApiService } from "../../../../../services/sportsbook-api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";

import { BetsSummaryComponent } from '../../../../active-matches/active/tabs/bets-summary/bets-summary.component';

@Component({
  selector: 'app-bets-summary',
  templateUrl: '../../../../active-matches/active/tabs/bets-summary/bets-summary.component.html',
  styleUrls: ['../../../../active-matches/active/tabs/bets-summary/bets-summary.component.scss']
})
export class FinishedBetsSummaryComponent extends BetsSummaryComponent implements OnInit {

  public title: string = 'Sport.Finished';
  public routerLink: string = '../../all-finished';

  constructor(
    protected injector: Injector,
    protected apiService: SportsbookApiService,
    protected _snackBar: MatSnackBar,
    protected activateRoute: ActivatedRoute) {
    super(
      injector,
      apiService,
      _snackBar,
      activateRoute
    );

  }

  ngOnInit(): void {
    this.matchId = this.activateRoute.snapshot.queryParams.finishId;
    this.partnerId = +this.activateRoute.snapshot.queryParams.partnerId;
    this.sportId = +this.activateRoute.snapshot.queryParams.sportId;
    this.name = this.activateRoute.snapshot.queryParams.name;
    this.marketConfig['MatchId'] = this.matchId;
    this.marketConfig['PartnerId'] = this.partnerId;
    this.getCategories();
    this.getMarketBets();
  }


}
