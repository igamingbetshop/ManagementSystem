import { DatePipe } from '@angular/common';
import { Component, OnInit, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CellClickedEvent, IRowNode, RowNode } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';
import { Controllers, GridMenuIds, Methods, ModalSizes } from 'src/app/core/enums';
import { Paging } from 'src/app/core/models';
import { CommonDataService } from 'src/app/core/services/common-data.service';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { SelectRendererComponent } from 'src/app/main/components/grid-common/select-renderer.component';
import { TextEditorComponent } from 'src/app/main/components/grid-common/text-editor.component';
import { CoreApiService } from '../../services/core-api.service';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends BasePaginatedGridComponent implements OnInit {

  public rowData = [];
  public partners: any[] = [];
  public settingTypes: any[] = [];
  frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    textEditor: TextEditorComponent,
    selectRenderer: SelectRendererComponent,
  };
  public status = [
    { Name: 'Active', Id: 1 },
    { Name: 'Inactive', Id: 2 }
  ];

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_CRM_SETTINGS;

  }

  ngOnInit() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_CRM_SETTINGS_TYPES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.settingTypes = data.ResponseObject;
          this.init();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }

      })
    this.gridStateName = 'crm-settings-grid-state';
    this.partners = this.commonDataService.partners;

  }

  init() {
    this.columnDefs = [
      {
        field: 'Id',
        sortable: true,
        resizable: true,
        tooltipField: 'Id',
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.NickeName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickeName',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellEditor: 'textEditor',
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
        resizable: true,
        sortable: true,
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange['bind'](this),
          Selections: this.settingTypes,
        }
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        resizable: true,
        sortable: true,
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange1['bind'](this),
          Selections: this.status,
        }
      },
      {
        headerName: 'Bonuses.Sequence',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Sequence',
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
        headerName: 'Bonuses.Condition',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Condition',
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
        headerName: 'Bonuses.StartTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StartTime',
        filter: false,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.StartTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Bonuses.FinishTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FinishTime',
        filter: false,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.FinishTime, 'medium');
          return `${dat}`;
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
          onClick: this.saveSettings['bind'](this),
          Label: 'Save',
          isDisabled: true
        }
      }
    ];

  }

  onSelectChange(params, val, event) {
    params.Type = val;
    this.onCellValueChanged(event);
  }

  onSelectChange1(params, val, event) {
    params.State = val;
    this.onCellValueChanged(event);
  }


  async AddSettings() {
    const { AddSettingsComponent } = await import('./add-settings/add-settings.component');
    const dialogRef = this.dialog.open(AddSettingsComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data)
        this.getCurrentPage();
    })

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

  onCellClicked(event: CellClickedEvent) {

  }

  saveSettings(params) {
    const row = params.data;
    this.apiService.apiPost(this.configService.getApiUrl, row,
      true, Controllers.CONTENT, Methods.SAVE_CRM_SETTINGS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'Settings successfully updated', Type: "success" });
          this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
          this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }

      })

  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        // paging.TakeCount = this.cacheBlockSize;
        paging.TakeCount = Number(this.cacheBlockSize);
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost(this.configService.getApiUrl, paging,
          true, Controllers.CONTENT, Methods.GET_CRM_SETTINGS)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject;
              mappedRows.forEach((entity) => {
                let partnerName = this.partners.find((partner) => {
                  return partner.Id == entity.PartnerId;
                })
                if (partnerName) {
                  entity['PartnerName'] = partnerName.Name;
                }
              })
              params.success({ rowData: mappedRows });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      },
    };
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    setTimeout(() => { this.gridApi.setServerSideDatasource(this.createServerSideDatasource()); }, 0);
  }

}
