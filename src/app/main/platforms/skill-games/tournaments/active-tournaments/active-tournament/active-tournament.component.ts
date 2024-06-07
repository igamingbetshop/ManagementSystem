import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

import {take} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DateAdapter} from "@angular/material/core";

import {SkillGamesApiService} from "../../../services/skill-games-api.service";
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-tournament',
  templateUrl: './active-tournament.component.html',
  styleUrls: ['./active-tournament.component.scss']
})
export class ActiveTournamentComponent implements OnInit {
  public path = 'tournament/active';
  public path2 = 'tournament/edit';
  public id;
  public formGroup: UntypedFormGroup;
  public tournament;
  public isEdit = true;
  public tournamentTypes = [
    { Id: 1, Name: 'Regular Tournament' },
    { Id: 2, Name: 'VIP Tournament' },
    { Id: 3, Name: 'Sit&Go' }
  ]
  isSendingReqest = false;

  constructor(
    private _snackBar: MatSnackBar,
    private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private router: Router,
    public apiService: SkillGamesApiService,
    public dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;
    this.createForm();
    this.getTournament();
  }

  getTournament() {
    let dat = {
      Ids: {
        ApiOperationTypeList: [{DecimalValue: this.id, IntValue: this.id, OperationTypeId: 1}],
        IsAnd: true
      }

    }
    this.apiService.apiPost(this.path, dat)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.tournament = data.ResponseObject.Entities[0];
          this.formGroup.patchValue(this.tournament)
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }

  createForm() {
    this.formGroup = this.fb.group({
      Id: [null],
      StartTime: [null],
      OpenTime: [null],
      Name: [null],
      NumberOfRounds: [null],
      JoinFee: [null],
      BuyInRound: [null],
      MinimumPlayersCount: [null],
      MaximumPlayersCount: [null],
      PrizePool: [null],
      PoolDistribution: [null],
      Type: [null],
    });
  }

  onSubmit() {
    const obj = this.formGroup.getRawValue();
    this.isSendingReqest = true;
    this.apiService.apiPost(this.path2, obj).subscribe(data => {
      if (data.ResponseCode === 0) {
        SnackBarHelper.show(this._snackBar, {Description: 'Success', Type: "success"});
        this.router.navigate(['/main/skillGames/tournaments/active-tournaments'])
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
      this.isSendingReqest = false;
    });
  }

}
