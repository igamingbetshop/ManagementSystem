import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";

import {take} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DateAdapter} from "@angular/material/core";

import {SkillGamesApiService} from "../../../services/skill-games-api.service";
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-tournament',
  templateUrl: './finished-tournament.component.html',
  styleUrls: ['./finished-tournament.component.scss']
})
export class FinishedTournamentComponent implements OnInit {
  public path = 'tournament/tournamentview';
  public id;
  public formGroup: UntypedFormGroup;
  public tournaments;
  public tournamentRounds: any[] = [];

  constructor(
    private _snackBar: MatSnackBar,
    private activateRoute: ActivatedRoute,
    public apiService: SkillGamesApiService
  ) {
  }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;
    this.getTournament();
  }

  getTournament() {
    let request = {
      TournamentId: this.id,
    }
    this.apiService.apiPost(this.path, request)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.separateRounds(data.ResponseObject.details);
          this.tournaments = data.ResponseObject;

        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }

  separateRounds(details: any) {
    let tournamentRounds = details.reduce((previous, target) => {
      if (typeof previous[target.TournamentRound] === 'undefined') {
        previous[target.TournamentRound] = [];
      }
      previous[target.TournamentRound].push(target);
      return previous;
    }, {});

    this.tournamentRounds = Object.values(tournamentRounds);
  }

}
