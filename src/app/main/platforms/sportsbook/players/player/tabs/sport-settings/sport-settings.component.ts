import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { UntypedFormBuilder } from "@angular/forms";
import { SportsbookApiService } from "../../../../services/sportsbook-api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { GridRowModelTypes } from "../../../../../../../core/enums";
import { AgGridAngular } from "ag-grid-angular";
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { DatePipe } from "@angular/common";
import { debounceTime, take } from "rxjs/operators";
import { AgBooleanFilterComponent } from "../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../../../../components/grid-common/numeric-editor.component";
import { CheckboxRendererComponent } from "../../../../../../components/grid-common/checkbox-renderer.component";
import { TextEditorComponent } from "../../../../../../components/grid-common/text-editor.component";
import { SelectRendererComponent } from "../../../../../../components/grid-common/select-renderer.component";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { Competitions } from "../../../../models/spotsbook.model";
import { Subject } from "rxjs";
import { Paging } from "../../../../../../../core/models";

@Component({
  selector: 'app-sport-settings',
  templateUrl: './sport-settings.component.html',
  styleUrls: ['./sport-settings.component.scss']
})
export class SportSettingsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public sports = [];
  public competitions: Competitions[] = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public playerId: number;
  public competitionId: number;
  public frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    textEditor: TextEditorComponent,
    selectRenderer: SelectRendererComponent,
  };
  public selectedSport;
  public selectedValue;
  public selectedRestriction;
  public restrictionTypes = [
    { Id: 1, Name: "Limit Percent" },
    { Id: 2, Name: "Delay Percent Prematch" },
    { Id: 3, Name: "Delay Percent Live" },
    { Id: 4, Name: "Delay Between Bets Prematch" },
    { Id: 5, Name: "Delay Between Bets Live" }
  ]
  private inputChanged$ = new Subject<string>();

  constructor(private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    protected injector: Injector) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Id',
        field: 'Id',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Type',
        field: 'TypeId',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Competition Id',
        field: 'CompetitionId',
        sortable: true,
        resizable: true,
        editable: true
      },
      {
        headerName: 'Competition Name',
        field: 'CompetitionName',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Player Id',
        field: 'PlayerId',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Sport Id',
        field: 'SportId',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Sport Name',
        field: 'SportName',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Value',
        field: 'Value',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Action',
        field: 'Action',
        resizable: true,
        minWidth: 150,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.deleteFinishes['bind'](this),
          Label: 'Delete',
          bgColor: '#3E4D66',
          textColor: 'white'
        }
      },
      {
        headerName: 'Save',
        field: 'Save',
        resizable: true,
        minWidth: 150,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.saveFinishes['bind'](this),
          Label: 'Save',
          bgColor: '#3E4D66',
          textColor: 'white'
        }
      }
    ]
  }

  ngOnInit() {
    this.playerId = this.activateRoute.snapshot.queryParams.playerId;
    this.getSportGames();
    this.getSportSettings();
    this.debounceCompetition();
  }

  debounceCompetition(): void {
    const time = 300;
    this.inputChanged$.pipe(debounceTime(time)).subscribe((value) => {
      if (typeof value === 'string') {
        this.getSportCompetitions(value);
      }
    });
  }

  getSportCompetitions(filterValue: string): void {
    const paging = new Paging();
    paging.PartnerId = this.playerId;
    paging.SportIds = { ApiOperationTypeList: [{ OperationTypeId: 1, DecimalValue: this.selectedSport, IntValue: this.selectedSport }], IsAnd: true };
    paging.Names = { ApiOperationTypeList: [{ OperationTypeId: 7, StringValue: filterValue }], IsAnd: true };
    this.apiService.apiPost('competitions', paging).subscribe(data => {
      if (data.Code === 0) {
        this.competitions = data.Objects;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  saveFinishes(params) {
    const row = params.data;
    this.apiService.apiPost('players/updateplayersportsetting', row)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.getSportSettings();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  deleteFinishes(params) {
    const row = params.data;
    this.apiService.apiPost('players/deleteplayersportsetting', row)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.getSportSettings();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getSportSettings() {
    this.apiService.apiPost('players/playersportsettings', { "Id": this.playerId })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData = data.Settings;

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getSportGames() {
    this.apiService.apiPost('sports').subscribe(data => {
      if (data.Code === 0) {
        this.sports = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  saveSportSettings() {
    let data = {
      SportId: this.selectedSport,
      PlayerId: this.playerId,
      TypeId: this.selectedRestriction,
      Value: this.selectedValue,
      CompetitionId: this.competitionId
    };

    this.apiService.apiPost('players/updateplayersportsetting', data)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.getSportSettings();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  findData(value: string) {
    this.inputChanged$.next(value);
  }

  changeSport(): void {
    this.competitionId = null;
    this.findData("");
  }

  getName(id: number): string {
    return this.competitions.find(book => book.Id === id)?.Name;
  }

}
