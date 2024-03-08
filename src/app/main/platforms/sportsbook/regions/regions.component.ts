import { Component, OnInit, Injector, ViewChild } from '@angular/core';

import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { AgGridAngular } from "ag-grid-angular";
import { IRowNode } from "ag-grid-community";
import 'ag-grid-enterprise';

import { MatSnackBar } from "@angular/material/snack-bar";
import { SportsbookApiService } from '../services/sportsbook-api.service';
import { CommonDataService } from "../../../../core/services";
import { GridMenuIds, GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { CheckboxRendererComponent } from 'src/app/main/components/grid-common/checkbox-renderer.component';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { TextEditorComponent } from 'src/app/main/components/grid-common/text-editor.component';
import { SnackBarHelper } from "../../../../core/helpers/snackbar.helper";
import { take } from 'rxjs';
import { MatDialog } from "@angular/material/dialog";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { RegionsInfoComponent } from './grids/regions-info/regions-info.component';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.scss']
})
export class RegionsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild(RegionsInfoComponent) regionsInfoComponent: RegionsInfoComponent;

  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public partnerId: number = 0;
  public partners: any[] = [];
  public frameworkComponents;
  public nestedFrameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
  };

  public DetailRowData = [];
  masterDetail;
  public isCanNotSelect = true;

  private path = 'regions';
  private CreateSettingsPath = 'regions/createsettings';
  private updatePath = 'regions/update';
  private settingsPath = 'regions/settings';
  private updateSettingsPath = 'regions/updatesettings';

  public detailCellRendererParams: any = {
    // provide the Grid Options to use on the Detail Grid
    detailGridOptions: {
      rowHeight: 47,
      // rowStyle: { color: 'white' },
      defaultColDef: {
        sortable: true,
        filter: true,
        flex: 1,
        onCellClicked: params => {
          this.onNestedRowSelected(params);
        }
      },
      components: this.nestedFrameworkComponents,
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
          headerName: 'Common.State',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Enabled',
          resizable: true,
          sortable: true,
          filter: 'agBooleanColumnFilter',
          cellRenderer: 'checkBoxRenderer',
          cellRendererParams: {

            onchange: this.onCheckBoxChangeNested.bind(this),
            onCellValueChanged: this.onCheckBoxChange.bind(this)
          }
        },
        {
          headerName: 'Bonuses.Priority',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Priority',
          resizable: true,
          sortable: true,
          editable: true,
          filter: 'agNumberColumnFilter',
          cellEditor: 'numericEditor',
          cellEditorPopup: true
        },
      ],
      onGridReady: params => {
        // params.api.setDomLayout('autoHeight');
      },

      onCellValueChanged: params => {
        if (params.column.getColId() === 'Priority') {
          this.nestedSavePartnerSettings(params)
        }
        this.onNestedRowSelected(params)
      },
    },
    // get the rows for each Detail Grid
    getDetailRowData: params => {
      if (params) {
        this.apiService.apiPost(this.settingsPath, { "RegionId": params.data.Id }).subscribe(data => {
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
                  <div style="height: 10%; font-weight: 700; font-size: 16px; color: #076192 "> ${name}</div>
                  <div ref="eDetailGrid" style="height: 90%;"></div>
               </div>`
    }
  }

  constructor(
    private apiService: SportsbookApiService,
    protected injector: Injector,
    public commonDataService: CommonDataService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_REGIONS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        checkboxSelection: true,
        cellRenderer: 'agGroupCellRenderer',
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
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
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Enabled',
        resizable: true,
        sortable: true,
        filter: 'agBooleanColumnFilter',
        cellRenderer: 'checkBoxRenderer',
        cellRendererParams: {
          onchange: this.onCheckBoxChange['bind'](this),
        }
      },
      {
        headerName: 'Bonuses.Priority',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Priority',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Cms.IsoCode',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsoCode',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agTextColumnFilter',
        cellEditor: 'textEditor',
      },
    ]
    this.masterDetail = true;

    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
      buttonRenderer: ButtonRendererComponent,
      numericEditor: NumericEditorComponent,
      checkBoxRenderer: CheckboxRendererComponent,
      textEditor: TextEditorComponent,
    }
  }

  ngOnInit() {
    this.gridStateName = 'regions-grid-state';
    this.apiService.apiPost('partners').subscribe(data => {
      if (data.Code === 0) {
        this.partners = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
    this.getRows();
  }

  onCellValueChanged(event) {
    if (event.oldValue !== event.value) {
      let findedNode: IRowNode;
      let node = event.node.rowIndex;
      this.gridApi.forEachNode(nod => {
        if (nod.rowIndex == node) {
          findedNode = nod;
        }
      })
      this.savePartnerSettings(event);
      this.gridApi.redrawRows({ rowNodes: [findedNode] });
    }
  }

  savePartnerSettings(params) {
    const row = params.data;
    this.apiService.apiPost(this.updatePath, row).subscribe(data => {
      if (data.Code === 0) {
        this.order();
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  nestedSavePartnerSettings(params, actionName = null) {
    const requestData = actionName ? params : params.data;
    this.apiService.apiPost(this.updateSettingsPath, requestData).subscribe(data => {
      if (data.Code === 0) {
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  order() {
    this.rowData = this.rowData.sort((a, b) => {
      return a.Priority - b.Priority;
    })
    this.gridApi.setRowData(this.rowData);
  }

  onCheckBoxChange(params, val, param) {
    console.log(params, val, param);
    
    params.Enabled = val;
    this.onCellValueChanged(param)
  }

  onCheckBoxChangeNested(params, value, param) {
    params.Enabled = value;
    this.nestedSavePartnerSettings(params, 'nestedCheckbox');
  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  getRows() {
    this.apiService.apiPost(this.path).subscribe(data => {
      if (data.Code === 0) {
        this.rowData = data.ResponseObject;
        this.order();
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  onPartnerChange(val: number) {
    this.partnerId = val;
  }

  addPartnerSettings() {
    if (this.partnerId == 0) {
      SnackBarHelper.show(this._snackBar, { Description: 'Please select partner', Type: "error" });
      return;
    }
    const row = this.gridApi.getSelectedRows()[0];
    const settings = {
      RegionId: row.Id,
      PartnerId: this.partnerId,
      Enabled: row.Enabled,
      Priority: row.Priority
    };

    this.apiService.apiPost(this.CreateSettingsPath, settings).subscribe(data => {
      if (data.Code === 0) {
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  async onCreateRegion() {
    const { CreateRegionComponent } = await import('./create-region/create-region.component');
    const dialogRef = this.dialog.open(CreateRegionComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data)
        this.rowData.unshift(data);
      this.gridApi.setRowData(this.rowData);
    })
  }

  onRegionInfoRemove() {
    this.regionsInfoComponent.deleteItem(this.gridApi.getSelectedRows()[0]);
  }

  onRowGroupOpened(params) {
    if (params.node.expanded) {
      this.gridApi.forEachNode(function (node) {
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

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  onRowSelected() {
    const regionId = this.gridApi.getSelectedRows()[0].Id;
    this.regionsInfoComponent.getRows(regionId);
  }

  onNestedRowSelected(params) {
    const regionId = params.data.RegionId;
    const partnerId = params.data.PartnerId;
    this.regionsInfoComponent.getRows(regionId, partnerId);
  }

  handleValueEmitted(value: boolean) {
    this.isCanNotSelect = value;
  }

}
