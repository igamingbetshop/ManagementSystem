import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";

import { take } from "rxjs/operators";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

import { ConfigService } from "../../../core/services";
import { SnackBarHelper } from "../../../core/helpers/snackbar.helper";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { SportsbookApiService } from "../../platforms/sportsbook/services/sportsbook-api.service";
import { Router } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-sb-quick-find",
  templateUrl: "./sb-quick-find.component.html",
  styleUrls: ["./sb-quick-find.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    MatSnackBarModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    
  ],
})
export class SBQuickFindComponent {
  public isQuickLinksOpened = false;
  private baseUrl = '/main/platform';
  private quickFindData: any;

  quickLinksFilter = {
    PlayerId: '',
    MatchId: '',
    CompetitionId: ''
  };

  quickLinksFilterGroups = [
    {
      title: 'Home.Sportsbook',
      filters: [
        { type: 'playerId', model: 'PlayerId', inputType: 'number', placeholder: 'SkillGames.PlayerId' },
        { type: 'matchId', model: 'MatchId', inputType: 'number', placeholder: 'Sport.MatchId' },
        { type: 'competitionId', model: 'CompetitionId', inputType: 'number', placeholder: 'Sport.CompetitionId' }
      ],
    }
  ];

  constructor(
    private sportsApiService: SportsbookApiService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private configService: ConfigService,
    private translate: TranslateService
  ) {}

  toggleQuickMenu(): void {
    this.isQuickLinksOpened = !this.isQuickLinksOpened;
  }

  searchQuickLink(searchType: string): void {
    const handlers: { [key: string]: () => void } = {
      playerId: () => this.handleSportsPlayerId(this.quickLinksFilter.PlayerId),
      matchId: () => this.handleSportsMatchId(this.quickLinksFilter.MatchId),
      competitionId: () => this.handleCompetitionId(this.quickLinksFilter.CompetitionId)
    };

    if (handlers[searchType]) {
      handlers[searchType]();
    }
  }

  private openWindowWithSearchData(path: string, value: string): void {
    const url = this.baseUrl + path;
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      newWindow['searchData'] = { value };
    } else {
      console.error('Failed to open window');
    }
  }

  private openUrl(route: any[], queryParams: any): void {
    const urlTree = this.router.createUrlTree(route, { queryParams });
    const url = this.router.serializeUrl(urlTree);
    if (url) {
      window.open(url, '_blank');
    } else {
      console.error('Failed to construct URL');
    }
  }

  handleSportsPlayerId(value: string): void {
    this.quickLinksFilter.PlayerId = value;
    this.sportsApiService.apiPost('players/player', { Id: +value })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.quickFindData = data.Player;
          this.openUrl(['/main/sportsbook/players/player/main'], { playerId: value });
        } else {
          this.showSnackBarError(data.Description);
        }
      });
  }

  handleSportsMatchId(value: string): void {
    this.quickLinksFilter.MatchId = value;
    this.sportsApiService.apiPost('matches/match', { MatchId: value })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.quickFindData = data.ResponseObject;
          const queryParams = { MatchId: value };

          if (data.ResponseObject.Status === 0 || data.ResponseObject.Status === 1) {
            this.openUrl(['/main/sportsbook/matches/active-matches/all-active/active/main'], queryParams);
          } else {
            this.openUrl(['/main/sportsbook/matches/finished/finish/main'], { finishId: value });
          }
        } else {
          this.showSnackBarError(data.Description);
        }
      });
  }

  handleCompetitionId(value: string): void {
    this.quickLinksFilter.CompetitionId = value;
    this.sportsApiService.apiPost('competitions/competition', { Id: value })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.quickFindData = data.ResponseObject;
          const queryParams = { competitionId: value };
          this.openUrl(['/main/sportsbook/competitions/competition/main'], queryParams);
        } else {
          this.showSnackBarError(data.Description);
        }
      });
  }

  private showSnackBarError(message: string): void {
    this._snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
