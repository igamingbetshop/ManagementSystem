import { Component, Injector, OnInit } from '@angular/core';
import { SportsbookApiService } from "../../../../../../services/sportsbook-api.service";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { take } from "rxjs/operators";
import { SnackBarHelper } from "../../../../../../../../../core/helpers/snackbar.helper";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

interface DataObject {
  RT: number;
  MP: number;
  TR: {
    T: number;
    V: string;
  }[];
}
interface EventDetail {
  Id: number;
  NickName: string;
  Name: string;
  Priority: number;
  TimeZone: number;
}
@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    TranslateModule,
    MatButtonModule,
  ]

})
export class ResultsComponent implements OnInit {
  path: string = 'matches/uncalculatedselections';
  number: number;
  matchId: number;
  partnerId: number;
  sportId: number;
  isEdit = false;
  partners: any[] = [];
  rowStyle;
  integerPattern = '^[0-9]+$';
  EventType = {
    Goal: 1,
    YellowCard: 2,
    RedCard: 3,
    Corner: 4,
    ShotOnGoals: 56,
    Folse: 18,
    Ofside: 48,
    Substitution: 47,
    PenaltyScored: 67,
    Penalty: 9
  };
  dataObjects: DataObject[] = [];
  RTValues = [1, 2, 3, 4, 56, 18, 48, 47, 67, 9];
  MPValues = [1, 5, 6];
  resultTypesEnum: { [key: string]: number; };
  firstTeamId: any;
  secondTeamId: any;

  constructor(protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getResultTypes();
    this.createObject();
    this.matchId = +this.activateRoute.snapshot.queryParams.MatchId || +this.activateRoute.snapshot.queryParams.finishId;
    this.number = this.activateRoute.snapshot.queryParams.number;
    this.partnerId = +this.activateRoute.snapshot.queryParams.partnerId;
    this.sportId = +this.activateRoute.snapshot.queryParams.sportId;
    this.getMatch();
  }

  createDataObject(RT: number, MP: number): DataObject {
    const TR = [
      { T: 1, V: '' },
      { T: 2, V: '' }
    ];

    return {
      RT,
      MP,
      TR
    };
  }

  createObject() {
    for (const RT of this.RTValues) {
      for (const MP of this.MPValues) {
        this.dataObjects.push(this.createDataObject(RT, MP));
      }
    }
  }

  getResultTypes() {
    this.apiService.apiPost('common/resulttypes')
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.resultTypesEnum = this.createEnumFromData(data.Objects);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  createEnumFromData(data: any[]): { [key: string]: number } {
    const enumObj: { [key: string]: number } = {};
    data.forEach(item => {
      enumObj[item.Id] = item.NickName;
    });
    return enumObj;
  }

  getMatch() {
    this.apiService.apiPost('matches/match', { MatchId: this.matchId, PartnerId: this.partnerId })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          const responseData = data.ResponseObject;
          this.firstTeamId = responseData.Competitors[0].TeamId;
          this.secondTeamId = responseData.Competitors[1].TeamId;
          responseData.Scores.forEach(score => {
            const existingDataObject = this.dataObjects.find(obj => obj.RT === score.RT && obj.MP === score.MP);
            if (existingDataObject) {
              existingDataObject['RTP'] = score.RTP;
              existingDataObject['S'] = score.S;
              existingDataObject['GS'] = score.GS;
              existingDataObject.TR = score.TR;
            }
          });

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }

      });
  }

  autoCalculate() {

    const filteredData = this.dataObjects.filter(obj =>
      obj.TR.some(tr => tr.V !== "")
    );

    filteredData.forEach((data) => {
      data.TR[0].T = 1;
      data.TR[1].T = 2;
    });

    const data = {
      "MatchId": this.matchId,
      "Results": filteredData
    };
    this.apiService.apiPost('markets/calculateoutcomes', data)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, { Description: "Updated", Type: "success" });
          this.getMatch();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }


  onSave() {
    const filteredData = this.dataObjects.filter(obj =>
      obj.TR.some(tr => tr.V !== "")
    );

    filteredData.forEach((data) => {
      data.TR[0].T = this.firstTeamId;
      data.TR[1].T = this.secondTeamId;
    });
    const data = {
      MatchId: this.matchId,
      Scores: filteredData
    };

    this.apiService.apiPost('matches/updatescores', data).subscribe(data => {
      if (data.Code === 0) {
        SnackBarHelper.show(this._snackBar, { Description: "Updated", Type: "success" });
        this.isEdit = false;
        this.getMatch();
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  onEditChange() {
    this.isEdit = false;
    this.getMatch();
  }

  onKeyPress(event: KeyboardEvent) {
    const inputChar = event.key;
    const pattern = /[0-9]/;

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
