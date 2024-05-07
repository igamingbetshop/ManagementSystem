import { Component, Injector, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { take } from 'rxjs/operators';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';
import { SnackBarHelper } from "../../../../../../../../core/helpers/snackbar.helper";
import { MATCH_STATUSES } from 'src/app/core/constantes/statuses';
import { GridRowModelTypes } from 'src/app/core/enums';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent extends BaseGridComponent implements OnInit {

  Providers: any[] = [];
  finishId: number;
  finishMatch: any = {};
  name: string = '';
  isEdit = false;
  Statuses = MATCH_STATUSES;
  rowData = [];
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  constructor(
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private activateRoute: ActivatedRoute,
    protected injector: Injector,
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TeamId',
        sortable: false,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.TeamName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TeamName',
        sortable: false,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.TeamId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TeamId',
        sortable: false,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeId',
        sortable: false,
        resizable: true,
        filter: false,
      },
    ];
   }

  ngOnInit() {
    this.finishId = +this.activateRoute.snapshot.queryParams.finishId;
    // this.name = this.activateRoute.snapshot.queryParams.name;
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
          const queryParams = { ...this.activateRoute.snapshot.queryParams };
          queryParams['sportId'] = data.ResponseObject.SportId;
          const navigationExtras: NavigationExtras = {
            queryParamsHandling: 'merge', 
            replaceUrl: true
          };
  
          this.router.navigate([], { ...navigationExtras, queryParams });
  
          this.finishMatch = data.ResponseObject;
          this.rowData = this.finishMatch.Competitors;
          this.name = this.finishMatch.Competitors[0].TeamName + ' vs ' + this.finishMatch.Competitors[1].TeamName;
          this.finishMatch.Name = this.name;
          this.finishMatch.currentPhase = this.finishMatch.CurrentPhaseId + '-' + this.finishMatch.CurrentPhaseName;
          this.finishMatch.StatusName = this.Statuses.find(x => x.status === this.finishMatch.Status).name;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

}
