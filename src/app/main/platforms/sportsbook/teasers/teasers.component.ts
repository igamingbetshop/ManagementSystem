import { Component, Injector, OnInit, ViewChild } from '@angular/core';

import { AgGridAngular } from "ag-grid-angular";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { take } from "rxjs/operators";
import {IRowNode} from "ag-grid-community";

import { BasePaginatedGridComponent } from "../../../components/classes/base-paginated-grid-component";
import { SportsbookApiService } from "../services/sportsbook-api.service";
import { CommonDataService } from "../../../../core/services";
import { GridRowModelTypes, ModalSizes } from "../../../../core/enums";
import { SnackBarHelper } from "../../../../core/helpers/snackbar.helper";
import { AgBooleanFilterComponent } from "../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../components/grid-common/numeric-editor.component";
import { CheckboxRendererComponent } from "../../../components/grid-common/checkbox-renderer.component";
import { SelectRendererComponent } from "../../../components/grid-common/select-renderer.component";
import { ACTIVITY_STATUSES, MATCH_STATUSES_OPTIONS } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-teasers',
  templateUrl: './teasers.component.html',
  styleUrls: ['./teasers.component.scss']
})
export class TeasersComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @ViewChild('agGridSecond') agGridSecond: AgGridAngular;
  rowData = [];
  rowData1 = [];
  columnDefs2;
  selectedItem;
  path: string = 'bets/teasers';
  updatePath: string = 'bets/updateteaser';
  addPath: string = 'bets/addteaser';
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
  matchStatus = MATCH_STATUSES_OPTIONS
  selectedRow;
  selectedRow1;
  isSendingReqest = false;

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
        headerName: 'Partners.PartnerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
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
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true,
        resizable: true,
        // editable: true,
        filter: 'agTextColumnFilter',
        cellRenderer: 'textEditor',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Sport.SelectionsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionsCount',
        resizable: true,
        sortable: true,
        // editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: 'numericEditor',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.MaxOpenSpots',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxOpenSpots',
        resizable: true,
        sortable: true,
        // editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: 'numericEditor',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.MaxPoint',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxPoint',
        resizable: true,
        sortable: true,
        // editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: 'numericEditor',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.BaseCoefficient',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BaseCoefficient',
        resizable: true,
        sortable: true,
        // editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: 'numericEditor',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.PointCoefficients',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PointCoefficients',
        resizable: true,
        sortable: true,
        // editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: 'numericEditor',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.TieRule',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TieRuleName',
        resizable: true,
        sortable: true,
        // editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: 'numericEditor',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.MatchStatus',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchStatusName',
        resizable: true,
        sortable: true
      },
      {
        headerName: 'Common.MinCoefficient',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MinCoefficient',
        resizable: true,
        sortable: true
      },
      {
        headerName: 'Common.MaxCoefficient',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxCoefficient',
        resizable: true,
        sortable: true
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StatusName',
        resizable: true,
        sortable: true,
        // editable: true,
        // cellRenderer: 'selectRenderer',
        // cellRendererParams: {
        //   onchange: this.onSelectChange['bind'](this),
        //   Selections: this.status,
        // }
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Sport.DropHalfPoints',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DropHalfPoints',
        resizable: true,
        sortable: true,
        // editable: true,
        filter: 'agBooleanColumnFilter',
        cellRenderer: 'checkBoxRenderer',
        // cellRendererParams: {
        //   onchange: this.onCheckBoxChange1['bind'](this),
        //
        // },
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return { color: 'black', backgroundColor: params.data.Color, pointerEvents: 'none' };
          } else {
            return null;
          }
        }
      },
      // {
      //   headerNaCommon.me: 'Save',
      //   field: 'save',
      //   resizable: true,
      //   sortable: false,
      //   filter: false,
      //   cellRenderer: 'buttonRenderer',
      //   cellRendererParams: {
      //     onClick: this.updateTeaser['bind'](this),
      //     Label: 'Save',
      //     isDisabled: true,
      //     bgColor: '#3E4D66',
      //     textColor: '#FFFFFF'
      //   }
      // }
    ];
    this.columnDefs2 = [
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
        headerName: 'Sport.CompetitionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionId',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: 'numericEditor',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.CompetitionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Sport.MarketTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketTypeId',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: 'numericEditor',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.MarketTypeName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketTypeName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Sport.BasePoint',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BasePoint',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.Save',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'save',
        resizable: true,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.updateSetting['bind'](this),
          Label: this.translate.instant('Common.Save'),
          isDisabled: true,
          bgColor: '#3E4D66',
          textColor: '#FFFFFF'
        }
      }
    ]
    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
      buttonRenderer: ButtonRendererComponent,
      numericEditor: NumericEditorComponent,
      checkBoxRenderer: CheckboxRendererComponent,
      selectRenderer: SelectRendererComponent
    }
  }

  ngOnInit(): void {
    this.getPartners();
    this.getTeasers();
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

  getTeasers() {
    this.apiService.apiPost(this.path).pipe(take(1)).subscribe((data) => {
      if (data.Code === 0) {
        const mappedRows = data.ResponseObject;
        mappedRows.forEach((entity) => {
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
          if (!this.selectedItem) {
            this.agGrid.api.getRenderedNodes()[0]?.setSelected(true);
          }
        }, 0)
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
      setTimeout(() => {
        this.agGrid.api.sizeColumnsToFit();
      }, 300);
    })
  }

  async addTeaser(action, obj) {
    obj.action = action;
    const { AddTeaserComponent } = await import('../teasers/add-teaser/add-teaser.component');
    const dialogRef = this.dialog.open(AddTeaserComponent, { width: ModalSizes.LARGE, data: obj });
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result === undefined) {
        dialogRef.close();
      } else if (!result?.Id) {
        this.createTeaser(result);
      } else if (result?.Id) {
        this.updateTeaser(result);
      }
    })
  }

  createTeaser(params) {
    this.apiService.apiPost('bets/addteaser', params)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'Teaser Added', Type: "success" });
          this.getTeasers();
          this.getSecondGridData();
          // this.rowData.push(data.ResponseObject)
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  updateTeaser(params) {
    this.selectedRow = params;
    this.apiService.apiPost(this.updatePath, this.selectedRow)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'Teaser updated', Type: "success" });
          this.getTeasers();
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
      this.selectedRow = params
      this.getSecondGridData(params);
    } else {
      return;
    }
  }

  onRowSelected1(params) {
    if (params.node.selected) {
      this.selectedRow1 = params.data;
    } else {
      return;
    }
  }

  getSecondGridData(params?) {
    this.selectedItem = params?.data;
    let settings = params?.data.Settings;
    this.rowData1 = settings;
    setTimeout(() => {
      this.agGridSecond.api.getRenderedNodes()[0]?.setSelected(true);
    }, 0)
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

  async addSetting() {
    this.isSendingReqest = true;
    let teaserId = +this.agGrid.api.getSelectedRows()[0].Id;
    const { AddSettingComponent } = await import('../teasers/add-setting/add-setting.component');
    const dialogRef = this.dialog.open(AddSettingComponent, { width: ModalSizes.LARGE, data: { TeaserId: teaserId } });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.selectedItem.Settings.push(data)
        this.apiService.apiPost(this.updatePath, this.selectedItem)
          .pipe(take(1))
          .subscribe(data => {
            if (data.Code === 0) {
              this.getTeasers();
              this.getSecondGridData();
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
            this.isSendingReqest = false;
          });
      }
    })
  }

  deleteSetting() {
    this.isSendingReqest = true;
    let teaserId = +this.agGrid.api.getSelectedRows()[0].Id;
    if (this.selectedItem.Id === this.selectedRow1.TeaserId) {
      let index = this.selectedItem.Settings.findIndex((item) => {
        return item.Id === this.selectedRow1.Id
      });
      this.selectedItem.Settings.splice(index, 1)
      this.apiService.apiPost(this.updatePath, this.selectedItem)
        .pipe(take(1))
        .subscribe(data => {
          if (data.Code === 0) {
            this.getTeasers();
            const selectedRowNodes = this.gridApi.getSelectedNodes();
            const selectedIds = selectedRowNodes.map(function (rowNode) {
              return rowNode.id;
            });
            this.rowData1 = this.rowData1.filter((dataItem) => {
              return selectedIds.indexOf(dataItem.symbol) < 0;
            });
            this.gridApi.setRowData(this.rowData1);
            SnackBarHelper.show(this._snackBar, { Description: 'Setting Deleted', Type: "success" });
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
          this.isSendingReqest = false;
        });
    }
  }

  updateSetting(params) {
    const row = params.data;

    if (this.selectedItem.Id === row.TeaserId) {
      this.apiService.apiPost(this.updatePath, this.selectedItem)
        .pipe(take(1))
        .subscribe(data => {
          if (data.Code === 0) {
            this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
            SnackBarHelper.show(this._snackBar, { Description: 'Teaser updated', Type: "success" });
            this.getTeasers();
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        });
    }
  }

  onClone() {
    const row = this.agGrid.api.getSelectedRows()[0];
    this.isSendingReqest = true;
    this.apiService.apiPost("bets/cloneteaser", { "Id": row.Id })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.getTeasers();
          SnackBarHelper.show(this._snackBar, { Description: "Success", Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      })
  }
}
