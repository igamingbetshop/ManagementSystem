import { Component, OnInit, Injector, ViewChild, ChangeDetectorRef } from '@angular/core';

import { take } from 'rxjs/operators';
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from '@angular/material/dialog';
import { AgGridAngular } from "ag-grid-angular";
import 'ag-grid-enterprise';
import { CommonDataService } from 'src/app/core/services';
import { IRowNode } from "ag-grid-community";

import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from '../services/sportsbook-api.service';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { ColorEditorComponent } from 'src/app/main/components/grid-common/color-editor.component';
import { CheckboxRendererComponent } from 'src/app/main/components/grid-common/checkbox-renderer.component';
import { TextEditorComponent } from 'src/app/main/components/grid-common/text-editor.component';
import { GridMenuIds, GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { SnackBarHelper } from "../../../../core/helpers/snackbar.helper";
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { ArrayEditorComponent } from 'src/app/main/components/grid-common/array-editor/array-editor.component';


@Component({
  selector: 'app-market-types',
  templateUrl: './market-types.component.html',
  styleUrls: ['./market-types.component.scss']
})
export class MarketTypesComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @ViewChild('agGridSecond') agGridSecond: AgGridAngular;
  isSendingReqest = false;
  partners: any[] = [];
  partnerId: number;
  sportId: number;
  sports: any[] = [];

  frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    arrayEditor: ArrayEditorComponent,
    colorEditor: ColorEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    textEditor: TextEditorComponent,
  };

  filter = {
    PageIndex: 0,
    PageSize: 5000,
    SportIds: {},
    PartnerId: undefined,
  };
  
  filteredData;
  masterDetail;
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  rowData = [];
  rowData1 = [];
  cacheBlockSize = 5000;
  columnDefs2;

  path: string = 'markettypes';
  nestedPath: string = 'markettypes/settings';
  selectPath: string = 'markettypes/selectiontypes';
  updateSettingsPath: string = 'markettypes/updatesettings'
  addPartnerSettingsPath: string = 'markettypes/createsettings'
  updatePath = 'markettypes/update';
  updateSelectionType = 'markettypes/updateselectiontype';


  detailCellRendererParams: any = {
    detailGridOptions: {
      rowHeight: 47,
      defaultColDef: {
        sortable: true,
        filter: true,
        flex: 1,
      },
      components: this.frameworkComponents,
      columnDefs: [
        {
          headerName: 'Sport.SettingID',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'SettingId',
          cellStyle: { color: '#076192' }
        },
        {
          headerName: 'Partners.PartnerName',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'PartnerName'
        },
        {
          headerName: 'Common.GroupIds',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'GroupIds',
          resizable: true,
          sortable: true,
          editable: true,
          filter: 'agNumberColumnFilter',
          filterParams: {
            buttons: ['apply', 'reset'],
            closeOnApply: true,
            filterOptions: this.filterService.numberOptions
          },
          cellEditor: 'arrayEditor',
        },
        {
          headerName: 'Sport.Color',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Color',
          sortable: false,
          resizable: true,
          editable: true,
          filter: 'agTextColumnFilter',
          filterParams: {
            buttons: ['apply', 'reset'],
            closeOnApply: true,
            filterOptions: this.filterService.textOptions
          },
          cellRenderer: function (params) {
            let color = params.data.Color;
            return `
                <div class="label" style="display: flex; justify-content: space-between; width: 117px">
                <label  for="head" style="color:${color}">${color}</label>
                <input  type="color" disabled name="head"  value = ${color}>
                </div>`;
          },
          cellEditor: 'colorEditor',
        },
        {
          headerName: 'Bonuses.Priority',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Priority',
          resizable: true,
          sortable: true,
          editable: true,
          filter: 'agNumberColumnFilter',
          filterParams: {
            buttons: ['apply', 'reset'],
            closeOnApply: true,
            filterOptions: this.filterService.numberOptions
          },
          cellEditor: NumericEditorComponent,
        },
        {
          headerName: 'Common.DisplayType',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'DisplayType',
          resizable: true,
          sortable: true,
          editable: true,
          filter: 'agNumberColumnFilter',
          cellEditor: NumericEditorComponent,
        },
        {
          headerName: 'Common.IsForFilter',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'IsForFilter',
          resizable: true,
          sortable: true,
          editable: true,
          filter: 'agNumberColumnFilter',
          cellRenderer: 'checkBoxRenderer',
          cellRendererParams: {
            onchange: this.onCheckBoxChangeFilter['bind'](this),
          }
        },
        {
          headerName: 'Common.State',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Enabled',
          resizable: true,
          sortable: true,
          filter: 'agBooleanColumnFilter',
          cellRenderer: 'checkBoxRenderer',
          cellRendererParams: {
            onchange: this.onCheckBoxChange2['bind'](this),
          }
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
            onClick: this.nestedSavePartnerSettings['bind'](this),
            Label: this.translate.instant('Common.Save'),
            bgColor: '#3E4D66',
            textColor: '#FFFFFF'
          }
        }
      ],
      onGridReady: params => {
        // params.api.setDomLayout('autoHeight');
      },
    },
    // get the rows for each Detail Grid
    getDetailRowData: params => {

      if (params) {

        this.apiService.apiPost(this.nestedPath, { "MarketTypeId": params.data.Id }).subscribe(data => {
          if (data.Code === 0) {
            const nestedRowData = data.ResponseObject;
            nestedRowData.forEach(row => {
              let partnerName = this.partners.find((partner) => {
                return partner.Id == row.PartnerId;
              })
              if (partnerName) {
                row['PartnerName'] = partnerName.Name;
              }
            })
            params.successCallback(nestedRowData);
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        })
      }

    },
    template: params => {
      const name = params.data.Name;
      return `<div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box;">
                  <div style="height: 10%; font-weight: 700; font-size: 16px; color: #3E4D66 "> ${name}</div>
                  <div ref="eDetailGrid" style="height: 90%;"></div>
               </div>`
    }
  }

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    public dialog: MatDialog,
    private ref: ChangeDetectorRef
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.MARKET_TYPES;
    this.columnDefs = [
      {
        headerName: 'Sport.MarketTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        checkboxSelection: true,
        minWidth: 120,
        tooltipField: 'Id',
        cellRenderer: 'agGroupCellRenderer',
        cellStyle: { color: '#3E4D66', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Common.GroupIds',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GroupIds',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'false',
        cellEditor: 'arrayEditor',
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Sport.Color',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Color',
        sortable: false,
        resizable: true,
        minWidth: 130,
        editable: true,
        filter: 'agTextColumnFilter',
        cellRenderer: function (params) {
          let color = params.data.Color;
          return `
          <div class="label" style="display: flex; justify-content: space-between; width: 117px">
          <label  for="head" style="color:${color}">${color}</label>
          <input  type="color" disabled name="head"  value = ${color}>
          </div>`;
        },
        cellEditor: 'colorEditor',
      },
      {
        headerName: 'Bonuses.Priority',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Priority',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: NumericEditorComponent,
      },
      {
        headerName: 'Common.IsForFilter',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsForFilter',
        resizable: true,
        sortable: true,
        filter: 'agBooleanColumnFilter',
        cellRenderer: 'checkBoxRenderer',
        cellRendererParams: {
          onchange: this.onCheckBoxChange1['bind'](this),
          onCellValueChanged: this.onCheckBoxChange1.bind(this)
        }
      },
      {
        headerName: 'Sport.LineNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LineNumber',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: NumericEditorComponent,
      },
      {
        headerName: 'Common.ResultTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ResultTypeId',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: NumericEditorComponent,
      },
      {
        headerName: 'Common.CombinationalNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CombinationalNumber',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: NumericEditorComponent,
      },
      {
        headerName: 'Common.ValueType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ValueType',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: NumericEditorComponent,
      },
      {
        headerName: 'Sport.SuccessOutcomeCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SuccessOutcomeCount',
        resizable: true,
        sortable: true,
        editable: false,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Common.DisplayType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DisplayType',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: NumericEditorComponent,
      },
      {
        headerName: 'Sport.SelectionsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionsCount',
        resizable: true,
        sortable: true,
        editable: false,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Enabled',
        resizable: true,
        sortable: true,
        filter: 'agBooleanColumnFilter',
        cellRenderer: 'checkBoxRenderer',
        cellRendererParams: {
          onchange: this.onCheckBoxChange2['bind'](this),
        }
      },
      {
        headerName: 'Bonuses.TranslationId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TranslationId',
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
        headerName: 'Common.Save',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'save',
        resizable: true,
        minWidth: 150,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.saveMarketTypes['bind'](this),
          Label: this.translate.instant('Common.Save'),
          isDisabled: true,
          bgColor: '#3E4D66',
          textColor: '#FFFFFF'
        }
      }
    ]

    this.columnDefs2 = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        minWidth: 55,
        resizable: true,
      },
      {
        headerName: 'Bonuses.TranslationId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TranslationId',
        resizable: true,
      },
      {
        headerName: 'Common.HeaderTranslationId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'HeaderTranslationId',
        resizable: true,
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
      },
      {
        headerName: 'Bonuses.Priority',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Priority',
        resizable: true,
        editable: true,
        cellEditor: NumericEditorComponent,
      },
      {
        headerName: 'Common.CalculationFormula',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CalculationFormula',
        resizable: true,
        editable: true,
        cellEditor: 'textEditor',
      },
      {
        headerName: 'Clients.CalculationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CalculationTime',
        resizable: true,
        editable: true,
        cellEditor: 'textEditor',
      },
      {
        headerName: 'Common.Save',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'save',
        resizable: true,
        minWidth: 130,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.saveSecondGridRow['bind'](this),
          Label: this.translate.instant('Common.Save'),
          isDisabled: true,
          bgColor: '#3E4D66',
          textColor: '#FFFFFF'
        },
      }
    ]
    this.masterDetail = true;
  }

  ngOnInit() {
    this.apiService.apiPost('sports').subscribe(data => {
      if (data.Code === 0) {
        this.sports = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
      this.getPage();
      this.getSecondGridData();
    })

    this.apiService.apiPost('partners').subscribe(data => {
      if (data.Code === 0) {
        this.partners = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
    this.gridStateName = 'market-type-grid-state';
    super.ngOnInit();
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  onPartnerChange(val) {
    this.partnerId = undefined;
    this.partnerId = val;
    this.go();
  }

  onPartnerChange1(val) {
    this.partnerId = undefined;
    this.partnerId = val;
  }

  onSportChange(val) {
    this.sportId = val;
    this.go();
  }

  go() {
    this.getPage();
  }

  onRowSelected(params) {
    if (params.node.selected) {
      this.getSecondGridData(params);
    } else {
      return;
    }
  }

  getSecondGridData(params?) {
    let id = params ? params.data.Id : 1;
    this.apiService.apiPost(this.selectPath, { 'MarketTypeId': id })
      .pipe(take(1))
      .subscribe(data => {

        if (data.Code === 0) {
          this.rowData1 = data.Selections;
          let count = 0
          this.rowData1.forEach(elem => count++)
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        setTimeout(() => { this.agGridSecond.api.sizeColumnsToFit(); }, 300);
      });
  }

  onCheckBoxChange1(params, val, event) {
    params.IsForFilter = val;
    this.onCellValueChanged(event)
  }

  onCheckBoxChange2(params, val, event) {
    params.Enabled = val;

    if (params.hasOwnProperty("MarketTypeId")) {
      this.nestedSavePartnerSettings(event)
    } else {
      this.saveMarketTypes(event)
    }
    // this.onCellValueChanged(event)
  }

  onCheckBoxChangeFilter(params, val, event) {
    params.IsForFilter = val;
    this.nestedSavePartnerSettings(event)
  }

  nestedSavePartnerSettings(params) {
    const row = params.data;

    this.apiService.apiPost(this.updateSettingsPath, row).subscribe(data => {
      if (data.Code === 0) {

      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  onCellValueChanged(event) {
    if (event.oldValue !== event.value) {
      let findedNode: IRowNode;
      let node = event.node.rowIndex;
      this.agGrid.api.forEachNode(nod => {
        if (nod.rowIndex == node) {
          findedNode = nod;
        }
      })
      this.agGrid.api.getColumnDef('save').cellRendererParams.isDisabled = false;
      this.agGrid.api.redrawRows({ rowNodes: [findedNode] });
    }
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

  saveMarketTypes(params) {
    const row = params.data;

    this.apiService.apiPost(this.updatePath, row).subscribe(data => {
      if (data.Code === 0) {
        this.agGrid.api.getColumnDef('save').cellRendererParams.isDisabled = true;
        SnackBarHelper.show(this._snackBar, { Description: "Updated", Type: "success" });
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  saveSecondGridRow(params) {
    const row = params.data;
    this.apiService.apiPost(this.updateSelectionType, row).subscribe(data => {
      if (data.Code === 0) {
        this.agGridSecond.api.getColumnDef('save').cellRendererParams.isDisabled = true;
        SnackBarHelper.show(this._snackBar, { Description: "Updated", Type: "success" });
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  onAddPartnerSettings() {
    if (!this.partnerId) {
      SnackBarHelper.show(this._snackBar, { Description: 'Select Partner', Type: "error" });
      return;
    }
    this.isSendingReqest = true;
    let row = this.agGrid.api.getSelectedRows()[0];
    let settings = {
      MarketTypeId: row.Id,
      PartnerId: this.partnerId,
      Enabled: row.Enabled,
      Priority: row.Priority,
      Color: row.Color
    };
    this.apiService.apiPost(this.addPartnerSettingsPath, settings).subscribe(data => {
      if (data.Code === 0) {
        SnackBarHelper.show(this._snackBar, { Description: 'Settings successfully added', Type: "success" });
      } else if (data.Code === 1) {
        //TODO should be come from backend
        SnackBarHelper.show(this._snackBar, { Description: "An unknown error occurred.", Type: "error" });
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Descriptio, Type: "error" });
      }
      this.isSendingReqest = false;
    })
  }

  async addMarketType() {
    const { AddMarketTypeComponent } = await import('../market-types/add-market-type/add-market-type.component');
    const dialogRef = this.dialog.open(AddMarketTypeComponent, { width: ModalSizes.BIG });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPage();
      }
    })
  }

  async addSelectionType() {
    this.isSendingReqest = true;
    let id = +this.agGrid.api.getSelectedRows()[0].Id;
    const { AddSelectionTypesComponent } = await import('../market-types/add-selection-types/add-selection-types.component');
    const dialogRef = this.dialog.open(AddSelectionTypesComponent, { width: ModalSizes.SMALL, data: { Id: id } });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.apiService.apiPost(this.selectPath, { 'MarketTypeId': id })
          .pipe(take(1))
          .subscribe(data => {
            if (data.Code === 0) {
              this.rowData1 = data.Selections;
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
            this.isSendingReqest = false;
          });
      }
    })
  }

  isRowSelectedSecond() {
    return this.agGridSecond?.api && this.agGridSecond?.api.getSelectedRows().length === 0;
  };

  onRowGroupOpened(params) {

    if (params.node.expanded) {

      this.agGrid.api.forEachNode(function (node) {

        if (
          node.expanded &&
          node.id !== params.node.id &&
          node.uiLevel === params.node.uiLevel
        ) {

          node.setExpanded(false);
        }
      });
    }
  }

  // onGridReady1(params) {
  //   super.onGridReady(params);
  // }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnSelectPanel();
    syncColumnReset();

  }



  getPage() {
    if (this.sportId) {
      this.filter.SportIds = { IsAnd: true, ApiOperationTypeList: [{ IntValue: this.sportId, OperationTypeId: 1 }] }
    }
    this.filter.PartnerId = this.partnerId;
    this.apiService.apiPost(this.path, this.filter)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData = data.ResponseObject;
          setTimeout(() => {
            this.agGrid.api.getRenderedNodes()[0]?.setSelected(true);
          }, 0)
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }

      });
  }

  exportToCsv() {
    this.apiService.apiPost('/markettypes/exportmarkettypes', this.filter).pipe(take(1)).subscribe((data) => {
      if (data.Code === 0) {
        let iframe = document.createElement("iframe");
        iframe.setAttribute("src", this.configService.defaultOptions.SBApiUrl + '/' + data.ResponseObject.ExportedFilePath);
        iframe.setAttribute("style", "display: none");
        document.body.appendChild(iframe);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

}
