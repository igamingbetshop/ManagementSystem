import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from 'rxjs';
import { SkillGamesApiService } from '../../../services/skill-games-api.service';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';

@Component({
  selector: 'app-add-cash-table',
  templateUrl: './add-cash-table.component.html',
  styleUrls: ['./add-cash-table.component.scss']
})
export class AddCashTableComponent implements OnInit {
  public games;
  public formGroup: UntypedFormGroup;
  public tableTypes = {
    types: [
      { 'id': 1, 'name': 'Public' },
      { 'id': 3, 'name': 'With password' }
    ],
    selectedType: { 'id': 1, 'name': 'Public' }
  };
  public backgammonTypes = {
    types: [
      { 'id': 1, 'name': 'Short' },
      { 'id': 2, 'name': 'Long' }
    ],
    selectedType: { 'id': 1, 'name': 'Short' }
  };
  isSendingReqest = false;
  // public selectedBackgammonType = this.tableTypes.types[0].id;
  // public selectedTableType = this.backgammonTypes.types[0].id;

  constructor(
    public dialogRef: MatDialogRef<AddCashTableComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    public apiService: SkillGamesApiService) {
  }

  ngOnInit(): void {
    this.getGames();
    this.createForm();
  }

  getGames() {
    this.apiService.apiPost('game').subscribe(data => {
      if (data.ResponseCode === 0) {
        this.games = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  public createForm() {
    this.formGroup = this.fb.group({
      GameId: [null, [Validators.required]],
      Speed: [null, [Validators.required]],
      Name: [null, [Validators.required]],
      BetAmount: [null, [Validators.required]],
      UnitId: [null, [Validators.required]],
      Type: [null, [Validators.required]],
      NumberOfRounds: [null, [Validators.required]],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    this.isSendingReqest = true;
    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost('cashtable/create', obj).pipe(take(1)).subscribe(data => {

      if (data.ResponseCode === 0) {
        this.dialogRef.close(obj);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
      this.isSendingReqest = false;
    });
  }


}
