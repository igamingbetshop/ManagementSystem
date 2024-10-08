import { Component, Injector, OnInit } from '@angular/core';

import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";

import { SportsbookApiService } from "../../../../../services/sportsbook-api.service";
import { CalculationComponent } from '../../../../active-matches/active/tabs/calculation/calculation.component';

@Component({
  selector: 'app-calculation',
  templateUrl: '../../../../active-matches/active/tabs/calculation/calculation.component.html',
  styleUrls: ['../../../../active-matches/active/tabs/calculation/calculation.component.scss']
})
export class FinishedCalculationComponent extends CalculationComponent implements OnInit {

  public title: string = 'Sport.Finished';
  public routerLink: string = '../../all-finished';


  public path: string = 'matches/uncalculatedselections';
  public name: string = '';

  constructor(protected injector: Injector,
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

  ngOnInit() {
    this.matchId = +this.activateRoute.snapshot.queryParams.finishId;
    this.name = this.activateRoute.snapshot.queryParams.name;
    this.number = this.activateRoute.snapshot.queryParams.number;
    this.sportId = +this.activateRoute.snapshot.queryParams.sportId;
    this.pageConfig = {
      MatchId: this.matchId
    };
    this.getCalculation();
  }



}
