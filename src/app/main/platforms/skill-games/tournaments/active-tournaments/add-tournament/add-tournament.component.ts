import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SkillGamesApiService} from "../../../services/skill-games-api.service";
import {CommonDataService} from "../../../../../../core/services";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";
import {DateAdapter} from "@angular/material/core";

@Component({
  selector: 'app-add-tournament',
  templateUrl: './add-tournament.component.html',
  styleUrls: ['./add-tournament.component.scss']
})
export class AddTournamentComponent implements OnInit {
  public games;
  public formGroup: UntypedFormGroup;
  public partners = [];
  public tournament: any;
  public partnerId;
  public tournamentTypes = {
    types: [
      {id: '1', name: 'Regular Tournament'},
      {id: '2', name: 'VIP Tournament'},
      {id: '3', name: 'Sit&Go'}
    ],
  };
  public backgammonTypes = {
    types: [
      {'id': 1, 'name': 'Short'},
      {'id': 2, 'name': 'Long'}
    ],
  };
  public images = [];
  private sendResponseOnce = false;
  isSendingReqest = false;

  constructor(
    public dialogRef: MatDialogRef<AddTournamentComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    public apiService: SkillGamesApiService, public commonDataService: CommonDataService,
    public dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.partners = this.commonDataService.partners;
    this.formValues();
    this.getGames();
  }

  getGames() {
    this.apiService.apiPost('game').subscribe(data => {
      if (data.ResponseCode === 0) {
        this.games = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    })
  }

  private formValues() {
    this.formGroup = this.fb.group({
      PartnerId: [null, [Validators.required]],
      Type:  [null, [Validators.required]],
      // ImageType: [null, [Validators.required]],
      GameId: [null, [Validators.required]],
      UnitId: [null, [Validators.required]],
      Name: [null, [Validators.required]],
      MinimumPlayersCount: [null, [Validators.required]],
      Speed: [null, [Validators.required]],
      MaximumPlayersCount: [null, [Validators.required]],
      NumberOfRounds: [null, [Validators.required]],
      PrizePool: [null, [Validators.required]],
      JoinFee: [null, [Validators.required]],
      PoolDistribution: [null, [Validators.required]],
      BuyInRound: [null, [Validators.required]],
      RegularityCount: [null, [Validators.required]],
      RegularityTime: [null, [Validators.required]],
      StartTime: [null, [Validators.required]],
      OpenTime: [null, [Validators.required]],
      ImageLobby: [null, [Validators.required]], // for development
      ImageTournament: [null, [Validators.required]], // for development
    })
  }

  close() {
    this.dialogRef.close();
  }

  onPartnerChange(val: number) {
    this.partnerId = val;
  }

  uploadFile(evt) {
    let files = evt.target.files;
    let file = files[0];
    if (files && file) {
      let reader = new FileReader();
      reader.onload = () => {
        const binaryString = reader.result as string;
        this.images.push({Data: binaryString.substr(binaryString.indexOf(',') + 1), Type: 1})
      };
      reader.readAsDataURL(file);
    }
  }

  uploadFile2(evt) {
    let files = evt.target.files;
    let file = files[0];
    if (files && file) {
      let reader = new FileReader();
      reader.onload = () => {
        const binaryString = reader.result as string;
        this.images.push({Data: binaryString.substr(binaryString.indexOf(',') + 1), Type: 2})
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.formGroup.invalid || this.sendResponseOnce) {
      return;
    }
    this.isSendingReqest = true;
    this.sendResponseOnce = true;
    this.tournament = this.formGroup.getRawValue();
    this.tournament.Images = this.images;

    this.apiService.apiPost('tournament/create', this.tournament).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(this.tournament);
      } else {
        this.sendResponseOnce = false;
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
      this.isSendingReqest = false;
    });
  }

}
