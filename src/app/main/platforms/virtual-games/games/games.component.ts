import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { BasePaginatedGridComponent } from "../../../components/classes/base-paginated-grid-component";
import { AgGridAngular } from "ag-grid-angular";
import { AgBooleanFilterComponent } from "../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../components/grid-common/numeric-editor.component";
import { CheckboxRendererComponent } from "../../../components/grid-common/checkbox-renderer.component";
import { TextEditorComponent } from "../../../components/grid-common/text-editor.component";
import { SelectRendererComponent } from "../../../components/grid-common/select-renderer.component";
import { GridRowModelTypes, ModalSizes } from "../../../../core/enums";
import { MatSnackBar } from "@angular/material/snack-bar";
import { VirtualGamesApiService } from "../services/virtual-games-api.service";
import { take } from "rxjs/operators";
import { SnackBarHelper } from "../../../../core/helpers/snackbar.helper";
import { IRowNode } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @ViewChild('agGrid1') agGrid1: AgGridAngular;
  public frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    textEditor: TextEditorComponent,
    selectRenderer: SelectRendererComponent,
  };
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public rowData1 = [];
  public columnDefs2;
  public rowData = [];
  public path: string = 'game';
  public path2: string = 'game/gameunits';
  public path3: string = 'game/editgameunitorder';
  selectedId: any;


  constructor(
    protected injector: Injector, 
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private apiService: VirtualGamesApiService) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        minWidth: 100,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'Clients.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'SkillGames.CurrentRound',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrentRound',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'SkillGames.BettingTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BettingTime',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'Clients.CalculationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CalculationTime',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'Bonuses.TranslationId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TranslationId',
        resizable: true,
        sortable: true,
      }
    ];
    this.columnDefs2 = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        minWidth: 100,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'Clients.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'SkillGames.GameId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameId',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'SkillGames.CurrentRound',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrentRound',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'SkillGames.Blocked',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Blocked',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'Common.Order',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Order',
        resizable: true,
        sortable: true,
        editable: true
      },
      {
        headerName: 'Bonuses.TranslationId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TranslationId',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'Common.Save',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'save',
        resizable: true,
        minWidth: 150,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.saveFinishes['bind'](this),
          Label: 'Save',
          isDisabled: true
        }
      }
    ]
  }

  ngOnInit(): void {
    this.getGames();
    this.getSecondGridData();
  }

  onRowSelected(params) {
    if (params.node.selected) {
      this.selectedId = params.data.Id;
      this.getSecondGridData(params);
    } else {
      return;
    }
  }

  addResetBTN() {
    const resetColumn = {
      headerName: 'Sport.Reset',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'View',
      resizable: true,
      minWidth: 150,
      sortable: false,
      filter: false,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.resetBlackJack['bind'](this),
        Label: this.translate.instant('Sport.Reset'),
        bgColor: 'red',
        textColor: 'white'
      },
      cellStyle: function (params) {
        if (params.data.Status == 1) {
          return { backgroundColor: '#aefbae' };
        } else {
          return null;
        }
      }
    }
    this.columnDefs2 = [...this.columnDefs2, resetColumn];
  }

  getSecondGridData(params?) {
    const row = params?.data;
    let countRows = this.agGrid?.api.getSelectedRows().length;
    if (countRows) {
      let data = {
        GameId: row.Id
      };
      this.apiService.apiPost(this.path2, data)
        .pipe(take(1))
        .subscribe(data => {
          if (data.ResponseCode === 0) {
            this.rowData1 = data.ResponseObject;
            if (row?.Id == 113) {
              this.addResetBTN();
            } else {
              this.columnDefs2 = this.columnDefs2.filter(item => item.field !== 'View');
            }
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        });
    }
  }

  getGames() {
    this.apiService.apiPost(this.path)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
          setTimeout(() => {
            this.agGrid.api.getRenderedNodes()[0]?.setSelected(true);
          }, 0)
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onGridReady1(params) {
    super.onGridReady(params);
  }

  onCellValueChanged(event) {
    if (event.oldValue !== event.value) {
      let findedNode: IRowNode;
      let node = event.node.rowIndex;
      this.agGrid1.api.forEachNode(nod => {
        if (nod.rowIndex == node) {
          findedNode = nod;
        }
      })
      this.agGrid1.api.getColumnDef('save').cellRendererParams.isDisabled = false;
      this.agGrid1.api.redrawRows({ rowNodes: [findedNode] });
    }
  }

  saveFinishes(params) {
    const row = params.data;
    let data = {
      Id: row.Id,
      Order: row.Order
    };
    this.apiService.apiPost(this.path3, data)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.agGrid1.api.getColumnDef('save').cellRendererParams.isDisabled = true;
          this.getSecondGridData()
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  resetBlackJack(params) {
    let row;
    if (params.data) {
      row = params.data;
    } else row = params;
    const sData = {
      TableId: row.Id,
      GameId: row.GameId,
    }

    this.apiService.apiPost('game/resetblackjack', sData)
      .subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, { Description: "Match reset is successfully!", Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  async createTable() {
    const { CreateTableComponent } = await import('./create-table/create-table.component');
    const dialogRef = this.dialog.open(CreateTableComponent, { width: ModalSizes.SMALL, data: { gameId: this.selectedId } });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data)
        this.rowData.unshift(data);
      this.gridApi.setRowData(this.rowData);
    })
  }

}
