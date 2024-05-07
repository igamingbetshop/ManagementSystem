import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import {take} from "rxjs/operators";
import {RoundStatuses} from "../../../all-pool-betting/all-pool-betting.component";
import { PBControllers, PBMethods } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { PoolBettingApiService } from 'src/app/main/platforms/sportsbook/services/pool-betting-api.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public roundId: number;
  public formGroup: UntypedFormGroup;
  public isEdit = false;
  public round: IRound;
  public roundStatuses = RoundStatuses;
  public underConfiguration = 1;

  constructor(
    private activateRoute: ActivatedRoute,
    private apiService: PoolBettingApiService,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
  ) {
  }

  ngOnInit() {
    this.roundId = this.activateRoute.snapshot.queryParams.roundId;
    this.createNonNullableForm();
    this.getRoundById();
  }

  getRoundById() {
    this.apiService.apiPost(PBControllers.ROUND, PBMethods.GET_ROUNDS_LIST, {Id: this.roundId}).pipe(take(1)).subscribe(data => {
      if (data.Code === 0) {
        const round = data.ResponseObject[0];
        round.StatusName = this.roundStatuses.find(status => status.Id == round.Status)?.Name;
        this.round =  round;
        this.createNonNullableForm();
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  createNonNullableForm() {
    this.formGroup = this.fb.nonNullable.group({
      Id: [{ value: this.round?.Id, disabled: true }],
      MarketTypeId: [this.round?.MarketTypeId],
      Number: [this.round?.Number],
      Status: [this.round?.Status],
      OpenTime: [this.round?.OpenTime],
      CloseTime: [this.round?.CloseTime],
      Blocked: [this.round?.Blocked],
      TicketsCount: [{ value: this.round?.TicketsCount, disabled: true }],
      Jackpot: [{ value: this.round?.Jackpot, disabled: true }],
      PoolAmount: [{ value: this.round?.PoolAmount, disabled: true }],
    });
  }

  publishRound() {
    const requestData = {RoundId: this.roundId};
    this.apiService.apiPost(PBControllers.ROUND, PBMethods.PUBLISH_ROUND, requestData).pipe(take(1)).subscribe(data => {
      if (data.Code === 0) {
        SnackBarHelper.show(this._snackBar, {Description: data.ResponseObject, Type: "success"});
        this.getRoundById();
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  onSubmit() {
    const requestData = this.formGroup.getRawValue();
    this.apiService.apiPost(PBControllers.ROUND, PBMethods.UPDATE_ROUND, requestData).pipe(take(1)).subscribe(data => {
      if (data.Code === 0) {
        this.getRoundById();
        this.isEdit =  false;
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  onCancel() {
    this.formGroup.reset();
    this.isEdit =  false;
  }
}

export interface IRound {
  Id: number;
  MarketTypeId: number;
  Number: number;
  Status: number;
  StatusName: string;
  OpenTime: Date;
  CloseTime: Date;
  Blocked: boolean;
  TicketsCount: number;
  Jackpot: number;
  PoolAmount: number;
}
