import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';
import { SnackBarHelper } from "../../../../../../../../core/helpers/snackbar.helper";
import { MATCH_STATUSES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public Providers: any[] = [];
  public finishId: number;
  public finishMatch: any = {};
  public name: string = '';
  public isEdit = false;
  public Statuses = MATCH_STATUSES;

  constructor(
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private activateRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.finishId = +this.activateRoute.snapshot.queryParams.finishId;
    this.name = this.activateRoute.snapshot.queryParams.name;
    this.getProviders();
    this.getPartner();
  }

  getProviders() {
    this.apiService.apiPost('providers').subscribe(data => {
      if (data.Code === 0) {
        this.Providers = data.Objects;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  updateProviders() {
    let sData = {
      MatchId: this.finishId,
      ProviderId: this.finishMatch.ProviderId
    };
    this.apiService.apiPost('matches/changeprovider', sData)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  resetMatch(value) {
    var sData = {
      MatchId: this.finishId,
      ServiceType: value
    };
    this.apiService.apiPost('matches/reset', sData)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, { Description: "Reseted", Type: "success" });

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getPartner() {
    this.apiService.apiPost('matches/match', { MatchId: this.finishId })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.finishMatch = data.ResponseObject;
          this.finishMatch.Name = this.name;
          this.finishMatch.currentPhase = this.finishMatch.CurrentPhaseId + '-' + this.finishMatch.CurrentPhaseName;
          this.finishMatch.StatusName = this.Statuses.find(x => x.status === this.finishMatch.Status).name;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

}
