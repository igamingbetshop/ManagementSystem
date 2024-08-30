import { Component, Injector, OnInit, ViewChild } from '@angular/core';

import { AgGridAngular } from "ag-grid-angular";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { take } from "rxjs/operators";
import { IRowNode } from "ag-grid-community";

import { ACTIVITY_STATUSES, MATCH_STATUSES_OPTIONS } from 'src/app/core/constantes/statuses';
import { GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { CommonDataService } from 'src/app/core/services';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-hot-bets',
  templateUrl: './hot-bets.component.html',
  styleUrls: ['./hot-bets.component.scss']
})
export class HotBetsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @ViewChild('agGridSecond') agGridSecond: AgGridAngular;
  rowData = [];
  selectedData = [];
  selectedItem;
  path: string = 'bets/hotbets';
  updatePath: string = 'bets/updatehotbet';
  addPath: string = 'bets/hotbets';
  frameworkComponents;
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  status = ACTIVITY_STATUSES;
  partners = [];
  tieRules = [
    { Id: 1, Name: 'No Bet' },
    { Id: 2, Name: 'Wins' },
    { Id: 3, Name: 'Losses' },
    { Id: 4, Name: 'Demotes' },
  ];
  public defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    minWidth: 50,
  };
  public types = [
    { Id: 1, Name: 'Single' },
    { Id: 2, Name: 'Multiple' },
  ];
  matchStatus = MATCH_STATUSES_OPTIONS
  selectedRow;
  selectedSecondRow = null;
  isSendingRequest = false;

  constructor(
    private apiService: SportsbookApiService,
    protected injector: Injector,
    public commonDataService: CommonDataService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',       
      },
      {
        headerName: 'Partners.PartnerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
      },
      {
        headerName: 'Sport.MatchStatusName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchStatusName',
      },
      {
        headerName: 'Sport.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
        cellRenderer: params => params.data.Type === 1 ? 'Single' : 'Multiple',
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StatusName',
        resizable: true,
        sortable: true,
        filter: 'agSetColumnFilter',
        filterParams: {
          values: ['Active', 'Inactive'],
          newRowsAction: 'keep',
          caseSensitive: false,
          cellHeight: 20,
        },
      },
      {
        headerName: 'Sport.BoostPercent',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BoostPercent',
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
      },
    ];
    this.frameworkComponents = {
      numericEditor: NumericEditorComponent,
    }
  }

  ngOnInit(): void {
    this.getPartners();
    this.getHotBets();
    this.getSecondGridData();
  }

  getPartners() {
    this.apiService.apiPost('partners').subscribe(data => {
      if (data.Code === 0) {
        this.partners = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  onCheckBoxChange1(params, val, event) {
    params.DropHalfPoints = val;
    this.onCellValueChanged(event);
  }

  getHotBets() {
    this.apiService.apiPost(this.path).pipe(take(1)).subscribe((data) => {
      if (data.Code === 0) {
        const mappedRows = data.ResponseObject;
        mappedRows.forEach((entity) => {
          entity.CreationTime = entity.CreationTime ? new Date(entity.CreationTime).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : null;            

          let tieRuleName = this.tieRules.find((tie) => {
            return tie.Id == entity.TieRule;
          })
          if (tieRuleName) {
            entity['TieRuleName'] = tieRuleName.Name;
          }
          let partnerName = this.partners.find((partner) => {
            return partner.Id == entity.PartnerId;
          })
          if (partnerName) {
            entity['PartnerName'] = partnerName.Name;
          }
          let statue = this.status.find((stat) => {
            return stat.Id == entity.Status;
          })
          if (statue) {
            entity['StatusName'] = statue.Name;
          }
          let matchStatusName = this.matchStatus.find((match) => {
            return match.Id == entity.MatchStatus;
          })
          if (matchStatusName) {
            entity['MatchStatusName'] = matchStatusName.Name;
          }
        })
        this.rowData = mappedRows;
        setTimeout(() => {
          if (this.agGrid && this.agGrid.api) {
            const firstRow = this.agGrid.api.getRenderedNodes()[0];
            if (firstRow && !this.selectedItem) {
              firstRow.setSelected(true);
            } else if (this.selectedItem) {
              const selectedRow = this.rowData.find(row => row.Id === this.selectedItem.Id);
              if (selectedRow) {
                this.agGrid.api.forEachNode(node => {
                  if (node.data.Id === selectedRow.Id) {
                    node.setSelected(true);
                  }
                });
              }
            }
          }
        }, 0);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  async addEditHotBet(action, obj) {
    const { AddHotBetComponent } = await import('./add-hot-bet/add-hot-bet.component');
    const dialogRef = this.dialog.open(AddHotBetComponent, { width: ModalSizes.MEDIUM, 
      data: {_data: obj.data,
        action: action,
      } });
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        this.selectedData = [];
        this.getHotBets();
      }
    })
  }

  updateTeaser(params) {
    this.selectedRow = params;
    this.apiService.apiPost(this.updatePath, this.selectedRow)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'Teaser updated', Type: "success" });
          this.getHotBets();
          this.getSecondGridData();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  isRowSelected() {
    return this.agGrid?.api && this.agGrid?.api.getSelectedRows().length === 0;
  };

  isRowSelected1() {
    return this.agGridSecond?.api && this.agGridSecond?.api.getSelectedRows().length === 0;
  };

  onCellValueChanged(event) {
    if (event.oldValue !== event.value) {
      let findedNode: IRowNode;
      let node = event.node.rowIndex;
      this.gridApi.forEachNode(nod => {
        if (nod.rowIndex == node) {
          findedNode = nod;
        }
      })
      this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = false;
      this.gridApi.redrawRows({ rowNodes: [findedNode] });
    }
  }

  onSelectChange(params, val, param) {
    params.Status = val;
    this.onCellValueChanged(param)
  }

  onRowSelected(params?) {
    if (params.node.selected) {
      this.selectedRow = params;
      this.getSecondGridData(params);
    } else {
      return;
    }
  }

  onSecondGridRowSelected(params) {
      this.selectedSecondRow = params;
  }

  getSecondGridData(params?) {
    this.selectedItem = params?.data;
    let settings = params?.data.Selections;
    this.selectedData = settings;
  }

  onGridReady1(params) {
    super.onGridReady(params);
  }

  onCellValueChanged1(event) {
    if (event.oldValue !== event.value) {
      let findedNode: IRowNode;
      let node = event.node.rowIndex;
      this.agGridSecond.api.forEachNode(nod => {
        if (nod.rowIndex == node) {
          findedNode = nod;
        }
      })
      this.agGridSecond.api.getColumnDef('save').cellRendererParams.isDisabled = false;
      this.agGridSecond.api.redrawRows({ rowNodes: [findedNode] });
    }
  }
  
  selectRowByTeaserId(teaserId: number) {
    const allNodes = [];
    this.agGrid.api.forEachNode(node => allNodes.push(node));
    const selectedNode = allNodes.find(node => node.data.Id === teaserId);
    if (selectedNode) {
      this.agGrid.api.ensureIndexVisible(selectedNode.rowIndex, 'middle');
      selectedNode.setSelected(true);
    }
  }


  updateSetting(params) {
    const row = params;
    if (this.selectedItem.Id === row.Id) {
      this.apiService.apiPost(this.updatePath, this.selectedItem)
        .pipe(take(1))
        .subscribe(data => {
          if (data.Code === 0) {
            SnackBarHelper.show(this._snackBar, { Description: 'Teaser updated', Type: "success" });
            this.getHotBets();
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        });
    }
  }


}
