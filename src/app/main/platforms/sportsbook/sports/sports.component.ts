import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { CommonDataService } from "../../../../core/services";
import { SportsbookApiService } from "../services/sportsbook-api.service";
import { AgGridAngular } from "ag-grid-angular";
import 'ag-grid-enterprise';
import { MatSnackBar } from "@angular/material/snack-bar";
import { GridMenuIds, GridRowModelTypes } from 'src/app/core/enums';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { ColorEditorComponent } from 'src/app/main/components/grid-common/color-editor.component';
import { CheckboxRendererComponent } from 'src/app/main/components/grid-common/checkbox-renderer.component';
import { BaseGridComponent } from "../../../components/classes/base-grid-component";
import { SnackBarHelper } from "../../../../core/helpers/snackbar.helper";
import { IRowNode } from "ag-grid-community";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-sports',
  templateUrl: './sports.component.html',
  styleUrls: ['./sports.component.scss']
})
export class SportsComponent extends BaseGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public cacheBlockSize: number = 120;
  public partnerId: number = 0;
  public partners: any[] = [];
  public frameworkComponents;
  public nestedFrameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    colorEditor: ColorEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
  };

  public DetailRowData = [];
  masterDetail;

  public detailCellRendererParams: any = {

    // provide the Grid Options to use on the Detail Grid
    detailGridOptions: {
      rowHeight: 47,
      // rowStyle: { color: 'white' },
      defaultColDef: {
        sortable: true,
        // filter: true,
        flex: 1,
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
          headerName: 'Sport.Color',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Color',
          sortable: false,
          resizable: true,
          editable: true,
          filter: false,
          cellRenderer: function (params) {
            let color = params.data.Color;
            return `
                <div class="label" style=" padding-top: 6px; display: flex; justify-content: space-between;">
                <label  for="head" style="color:${color};  padding-right: 60px ">${color}</label>
                <input  type="color" disabled name="head"  value = ${color}>
                </div>`;
          },
          cellEditor: 'colorEditor',
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
          headerName: 'Sport.LiveTemplateType',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'LiveTemplateType',
          resizable: true,
          sortable: true,
          editable: true,
          filter: 'agNumberColumnFilter',
          cellEditor: 'numericEditor',
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
            isDisabled: true,
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

        this.apiService.apiPost(this.settingsPath, { "SportId": params.data.Id }).subscribe(data => {
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

  private path = 'sports';
  private CreateSettingsPath = 'sports/createsettings';
  private updatePath = 'sports/update';
  private settingsPath = 'sports/settings';
  private updateSettingsPath = 'sports/updatesettings';
  public errorDescription: string;
  public showErrorBar: boolean;

  constructor(
    private apiService: SportsbookApiService,
    protected injector: Injector,
    public commonDataService: CommonDataService,
    private _snackBar: MatSnackBar,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_SPORTS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        checkboxSelection: true,
        tooltipField: 'Id',
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
        headerName: 'Sport.Color',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Color',
        sortable: false,
        resizable: true,
        editable: true,
        filter: false,
        cellRenderer: function (params) {
          let color = params.data.Color;
          return `
          <div class="label" style=" padding-top: 6px; display: flex; justify-content: space-between;">
          <label  for="head" style="color:${color}">${color}</label>
          <input  type="color" disabled name="head"  value = ${color}>
          </div>`;
        },
        cellEditor: 'colorEditor',
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
      },
      {
        headerName: 'Sport.LiveTemplateType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LiveTemplateType',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: 'numericEditor',
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
          onClick: this.savePartnerSettings['bind'](this),
          Label: this.translate.instant('Common.Save'),
          isDisabled: true,
          bgColor: '#3E4D66',
          textColor: '#FFFFFF'
        },
      }
    ]
    this.masterDetail = true;

    this.sideBar = {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Sport',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel'
        }
      ],
    }

    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
      buttonRenderer: ButtonRendererComponent,
      numericEditor: NumericEditorComponent,
      colorEditor: ColorEditorComponent,
      checkBoxRenderer: CheckboxRendererComponent,
    }
  }

  ngOnInit() {
    this.gridStateName = 'sports-grid-state';
    this.apiService.apiPost('partners').subscribe(data => {
      if (data.Code === 0) {
        this.partners = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
    this.getPage();
  }

  savePartnerSettings(params) {
    const row = params.data;
    this.apiService.apiPost(this.updatePath, row).subscribe(data => {
      if (data.Code === 0) {
        this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
        this.order();
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
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

  order() {
    this.rowData = this.rowData.sort((a, b) => {
      return a.Priority - b.Priority;
    })
    this.gridApi.setRowData(this.rowData);
  }


  onCheckBoxChange(params, val, event) {
    params.Enabled = val;
    this.onCellValueChanged(event);
  }
  onCheckBoxChange2(params, val, event) {
    params.Enabled = val;
  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  getPage() {
    this.apiService.apiPost(this.path).subscribe(data => {
      if (data.Code === 0) {
        this.rowData = data.ResponseObject;
        this.order();
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
      setTimeout(() => { this.gridApi.sizeColumnsToFit(); }, 300);
    });
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
      this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = false;
      this.gridApi.redrawRows({ rowNodes: [findedNode] });
    }
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

  onPartnerChange(val: number) {
    this.partnerId = val;
  }

  addPartnerSettings() {
    if (this.partnerId == 0) {
      SnackBarHelper.show(this._snackBar, { Description: 'please select partner', Type: "error" });
      return;
    }
    const row = this.gridApi.getSelectedRows()[0];
    const settings = {
      SportId: row.Id,
      PartnerId: this.partnerId,
      Enabled: row.Enabled,
      Priority: row.Priority,
      Color: row.Color,
      LiveTemplateType: row.LiveTemplateType
    };

    this.apiService.apiPost(this.CreateSettingsPath, settings).subscribe(data => {
      if (data.Code === 0) {

      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();

  }
}
