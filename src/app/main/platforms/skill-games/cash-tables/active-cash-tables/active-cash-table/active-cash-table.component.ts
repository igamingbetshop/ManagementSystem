import {Component, Injector, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {take} from "rxjs/operators";
import { GridRowModelTypes } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SkillGamesApiService } from '../../../services/skill-games-api.service';

@Component({
  selector: 'app-cash-table',
  templateUrl: './active-cash-table.component.html',
  styleUrls: ['./active-cash-table.component.scss']
})
export class ActiveCashTableComponent extends BasePaginatedGridComponent implements OnInit {
  public path = 'cashtable/active';
  public id;
  public formGroup: UntypedFormGroup;
  public cashTable;
  public rowData = [];
  public rowModelType:string = GridRowModelTypes.CLIENT_SIDE;
  public isEdit = false;
  public isSaveActive: boolean;


  constructor(
    private _snackBar: MatSnackBar,
    private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    public apiService: SkillGamesApiService,
    protected injector: Injector
  ) {
    super(injector)

    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.CurrentState',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrentState',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'SkillGames.PlayerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PlayerId',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'SkillGames.PlayerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PlayerName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Sport.Score',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Score',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'SkillGames.SeatId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SeatId',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Status',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
    ]
  }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;
    this.createForm();
    this.getCashTable();
  }

  getCashTable() {
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
          this.cashTable = data.ResponseObject.Entities[0];

          this.formGroup.get('Id').setValue(this.cashTable['Id']);
          this.formGroup.get('CreationTime').setValue(this.cashTable['CreationTime']);
          this.formGroup.get('CurrentRound').setValue(this.cashTable['CurrentRound']);
          this.formGroup.get('GameId').setValue(this.cashTable['GameId']);
          this.formGroup.get('Name').setValue(this.cashTable['Name']);
          this.formGroup.get('JoinedPlayersCount').setValue(this.cashTable['JoinedPlayersCount']);
          this.formGroup.get('LastActionTime').setValue(this.cashTable['LastActionTime']);
          this.formGroup.get('MinBet').setValue(this.cashTable['MinBet']);
          this.formGroup.get('MaxBet').setValue(this.cashTable['MaxBet']);
          this.formGroup.get('NumberOfRounds').setValue(this.cashTable['NumberOfRounds']);
          this.formGroup.get('Speed').setValue(this.cashTable['Speed']);
          this.formGroup.get('Stage').setValue(this.cashTable['Stage']);
          this.formGroup.get('Type').setValue(this.cashTable['Type']);

          this.rowData =  this.cashTable.BoardPlayers;
          this.gridApi.setRowData(this.rowData);
          this.formGroup.valueChanges.subscribe(data => {
            this.isSaveActive = true
          });

        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }

  createForm() {
    this.formGroup = this.fb.group({
      Id: [null],
      LastActionTime: [null],
      CreationTime: [null],
      Name: [null],
      CurrentRound: [null],
      GameId: [null],
      JoinedPlayersCount: [null],
      MinBet: [null],
      MaxBet: [null],
      NumberOfRounds: [null],
      Speed: [null],
      Stage: [null],
      Type: [null],
    });
  }

  onSubmit() {
    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost('cashtable/edit', obj).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.isEdit = false;
        SnackBarHelper.show(this._snackBar, {Description: 'Success', Type: "success"});
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  public cancel() {
    this.isEdit = false;
  }
}
