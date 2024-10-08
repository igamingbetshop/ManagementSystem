import { Component, Injector, OnInit } from '@angular/core';
import { SportsbookApiService } from "../../../../../services/sportsbook-api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { EventsComponent } from '../../../../active-matches/active/tabs/events/events.component';

@Component({
  selector: 'app-events',
  templateUrl: '../../../../active-matches/active/tabs/events/events.component.html',
  styleUrls: ['../../../../active-matches/active/tabs/events/events.component.scss']
})
export class FinishedEventsComponent extends EventsComponent implements OnInit {

  public title: string = 'Sport.Finished';
  public routerLink: string = '../../all-finished';


  constructor(protected injector: Injector,
    protected apiService: SportsbookApiService,
    protected _snackBar: MatSnackBar,
    protected activateRoute: ActivatedRoute) {
    super(
      injector,
      apiService,
      _snackBar,
      activateRoute);

  }

  ngOnInit() {
    this.matchId = this.activateRoute.snapshot.queryParams.finishId;
    this.name = this.activateRoute.snapshot.queryParams.name;
    this.pageConfig = {
      MatchId: this.matchId
    };
    this.getEvents();
  }

}
