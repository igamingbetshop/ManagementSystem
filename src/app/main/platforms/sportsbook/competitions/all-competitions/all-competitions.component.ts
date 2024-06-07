import { Component, OnInit, Injector, ViewChild, ViewContainerRef } from '@angular/core';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { take } from 'rxjs/operators';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { CheckboxRendererComponent } from 'src/app/main/components/grid-common/checkbox-renderer.component';
import { MatDialog } from "@angular/material/dialog";
import 'ag-grid-enterprise';
import { CommonDataService } from 'src/app/core/services';
import { Paging } from 'src/app/core/models';
import { GridMenuIds, ModalSizes } from 'src/app/core/enums';
import { SelectRendererComponent } from "../../../../components/grid-common/select-renderer.component";
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { CellClickedEvent, IRowNode } from "ag-grid-community";
import { AgGridAngular } from "ag-grid-angular";
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { MatMenuTrigger } from "@angular/material/menu";

@Component({
  selector: 'app-all-competitions',
  templateUrl: './all-competitions.component.html',
  styleUrls: ['./all-competitions.component.scss']
})

export class AllCompetitionsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('bulkMenuTrigger') bulkMenuTrigger: MatMenuTrigger;
  @ViewChild('bulkEditorRef', { read: ViewContainerRef }) bulkEditorRef!: ViewContainerRef;
  public partners: any[] = [];
  public providers: any[] = [];
  public partnerId: number;
  public masterDetail;
  public rowData = [];
  public rowDataNested = [];
  public path: string = 'competitions';
  public updatePath: string = 'competitions/update';
  public addPartnerSettingsPath: string = 'competitions/createsettings';
  public nestedPath: string = 'competitions/settings';
  public updateNestedPath: string = 'competitions/updatesettings';
  public checkedRowAll: boolean = false;
  public isDisabled = true;
  private selectedRowIdsAll: number[] = [];
  private filterData: Paging;
  public frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    selectRenderer: SelectRendererComponent,
  };
  isSendingReqest = false;
  private multipleBetsStates = [
    { Id: 1, Name: this.translate.instant('Sport.None'), State: null },
    { Id: 2, Name: this.translate.instant('Common.Yes'), State: true },
    { Id: 3, Name: this.translate.instant('Common.No'), State: false },
  ];

  public detailCellRendererParams: any = {
    detailGridOptions: {
      rowHeight: 47,
      defaultColDef: {
        sortable: true,
        filter: false,
        flex: 1,
      },
      components: this.frameworkComponents,
      columnDefs: [
        {
          headerName: 'Sport.SettingId',
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
          cellEditor: 'numericEditor',
        },
        {
          headerName: 'Sport.AbsoluteLimit',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'AbsoluteLimit',
          resizable: true,
          sortable: true,
          editable: true,
          cellEditor: 'numericEditor',
        },
        {
          headerName: 'Sport.Delay',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Delay',
          resizable: true,
          sortable: true,
          editable: true,
          cellEditor: 'numericEditor',
        },
        {
          headerName: 'Sport.MaxWinPrematchSingle',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'MaxWinPrematchSingle',
          resizable: true,
          sortable: true,
          editable: true,
          cellEditor: 'numericEditor',
        },
        {
          headerName: 'Sport.MaxWinPrematchMultiple',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'MaxWinPrematchMultiple',
          resizable: true,
          sortable: true,
          editable: true,
          cellEditor: 'numericEditor',
        },
        {
          headerName: 'Sport.MaxWinLiveSingle',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'MaxWinLiveSingle',
          resizable: true,
          sortable: true,
          editable: true,
          cellEditor: 'numericEditor',
        },
        {
          headerName: 'Sport.MaxWinLiveMultiple',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'MaxWinLiveMultiple',
          resizable: true,
          sortable: true,
          editable: true,
          cellEditor: 'numericEditor',
        },
        {
          headerName: 'Products.CategoryId',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'CategoryId',
          resizable: true,
          sortable: true,
          editable: true,
          cellEditor: 'numericEditor',
        },
        {
          headerName: 'Common.Save',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'save',
          resizable: true,
          minWidth: 140,
          sortable: false,
          cellRenderer: 'buttonRenderer',
          cellRendererParams: {
            onClick: this.nestedSavePartnerSettings['bind'](this),
            Label: 'Save',
            bgColor: '#3E4D66',
            textColor: '#FFFFFF'
          }
        },
        {
          headerName: 'Common.View',
          headerValueGetter: this.localizeHeader.bind(this),
          cellRenderer: function (params) {
            if (params.node.rowPinned) {
              return '';
            } else {
              return `<i style=" color:#076192; padding-left: 20px; cursor: pointer;" class="material-icons">
             visibility
              </i>`
            }

          },
          onCellClicked: (event: CellClickedEvent) => this.goToCompetition(event),
        },
      ],
      onGridReady: params => {
      },
    },
    getDetailRowData: params => {

      if (params) {
        this.apiService.apiPost(this.nestedPath, { "CompetitionId": params.data.Id }).subscribe(data => {
          if (data.Code === 0) {
            this.rowDataNested = data.ResponseObject;
            this.rowDataNested.forEach(row => {
              let partnerName = this.partners.find((partner) => {
                return partner.Id == row.PartnerId;
              })
              if (partnerName) {
                row['PartnerName'] = partnerName.Name;
              }
            })
            this.setIdByBoolean(this.rowDataNested);
            params.successCallback(this.rowDataNested);
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
    private _snackBar: MatSnackBar,
    protected injector: Injector,
    public dialog: MatDialog,
    public commonDataService: CommonDataService,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_COMPETITONS_ALL;
    this.columnDefs = [
      {
        field: '',
        minWidth: 50,
        maxWidth: 50,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        filter: false,
        menuTabs: false
      },
      {
        headerName: 'Sport.CompetitionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        minWidth: 140,
        tooltipField: 'Id',
        cellRenderer: 'agGroupCellRenderer',
        cellStyle: { color: '#076192', 'font-size': '12px', 'font-weight': '500' },
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
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
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
        headerName: 'Sport.RegionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RegionName',
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
        headerName: 'Sport.Provider',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProviderName',
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
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Sport.AbsoluteLimit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AbsoluteLimit',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Sport.Delay',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Delay',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Sport.MaxWinPrematchSingle',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxWinPrematchSingle',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Sport.MaxWinPrematchMultiple',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxWinPrematchMultiple',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Sport.MaxWinLiveSingle',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxWinLiveSingle',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Sport.MaxWinLiveMultiple',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxWinLiveMultiple',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellEditor: 'numericEditor',
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
        headerName: 'Partners.Rating',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Rating',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Products.CategoryId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CategoryId',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Sport.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellEditor: 'numericEditor',
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
        minWidth: 140,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.saveCategorySettings['bind'](this),
          Label: this.translate.instant('Common.Save'),
          // isDisabled: this.isDisabled
          bgColor: '#3E4D66',
          textColor: '#FFFFFF'
        }
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: function (params) {
          if (params.node.rowPinned) {
            return '';
          } else {
            return `<i style=" color:#076192; padding-left: 20px; cursor: pointer;" class="material-icons">
           visibility
            </i>`
          }

        },
        onCellClicked: (event: CellClickedEvent) => this.goToCompetition(event),
      },
    ];
    this.masterDetail = true;
  }

  ngOnInit() {
    this.partners = this.commonDataService.partners;
    this.gridStateName = 'competitions-grid-state';
    this.getProviders();
  }

  onSelectCashOut(params, value: number, event) {
    params.AllowCashout = this.multipleBetsStates.find(el => el.Id === value).State;
  }

  nestedSavePartnerSettings(params) {
    const row = params.data;
    this.apiService.apiPost(this.updateNestedPath, row).subscribe(data => {
      if (data.Code === 0) {
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  onCheckBoxChange(params, value, event) {
    params.Enabled = value;
    this.onCellValueChanged(event);
  }

  onCheckBoxChange2(params, value, event) {
    params.Enabled = value;
  }

  onPartnerChange(value) {
    this.partnerId = value;
  }

  async addSettings() {
    this.isSendingReqest = true;
    const row = this.gridApi.getSelectedRows()[0];
    let settings = {
      CompetitionId: row.Id,
      PartnerId: this.partnerId,
      Enabled: row.Enabled,
      Priority: row.Priority,
      AbsoluteLimit: row.AbsoluteLimit,
      Delay: row.Delay
    };
    this.apiService.apiPost(this.addPartnerSettingsPath, settings)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'added successfully', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      })
  }

  async AddCompetition() {
    const { CreateCompetitionComponent } = await import('../../competitions/create-competition/create-competition.component');
    const dialogRef = this.dialog.open(CreateCompetitionComponent, { width: ModalSizes.MIDDLE });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getCurrentPage();
      }
    })
  }

  onCellValueChanged(event) {
    if (event.oldValue !== event?.value) {
      let findedNode: IRowNode;
      let node = event?.node.rowIndex;
      this.gridApi.forEachNode(nod => {
        if (nod.rowIndex == node) {
          findedNode = nod;

        }
      })
      this.isDisabled = false;
      this.gridApi.redrawRows({ rowNodes: [findedNode] });
    }
  }

  saveCategorySettings(params) {
    let requestBody = params.data;

    if (requestBody['AllowMultipleBets'] == null) {
      requestBody.AllowMultipleBetsMapped = 'NULL';
    } else if (requestBody['AllowMultipleBets'] == true) {
      requestBody.AllowMultipleBetsMapped = "YES";
    } else if (requestBody['AllowMultipleBets'] == false) {
      requestBody.AllowMultipleBetsMapped = "NO";
    }

    if (requestBody['AllowCashout'] == null) {
      requestBody.AllowCashoutMapped = 'NULL';
    } else if (requestBody.AllowCashout == true) {
      requestBody.AllowCashoutMapped = "YES";
    } else if (requestBody.AllowCashout == false) {
      requestBody.AllowCashoutMapped = "NO";
    }

    this.apiService.apiPost(this.updatePath, requestBody).subscribe(data => {
      if (data.Code === 0) {
        this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnSelectPanel();
    syncColumnReset();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.PageIndex = this.paginationPage - 1;
        paging.PageSize = Number(this.cacheBlockSize);
        paging.PartnerId = this.partnerId;

        this.setSort(params.request.sortModel, paging, "OrderByDescending");
        this.setFilter(params.request.filterModel, paging);
        this.filterData = { ...paging };
        this.apiService.apiPost(this.path, paging)
          .pipe(take(1))
          .subscribe(data => {
            if (data.Code === 0) {
              this.setIdByBoolean(data.Objects);
              const mappedRows = data.Objects;
              mappedRows.forEach((bet) => {
                let providerName = this.providers.find((provider) => {
                  return provider.Id == bet.ProviderId;
                })
                // if (providerName) {
                //   bet['ProviderId'] = providerName.Name;
                // }
              })
              params.success({ rowData: data.Objects, rowCount: data.TotalCount });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      },
    };
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  setIdByBoolean(responseData): void {
    responseData.forEach(field => {
      this.checkBetState(field, 'AllowMultipleBets')
      this.checkBetState(field, 'AllowCashout')
    });
  }

  checkBetState(field, fieldKey: string) {
    if (field[fieldKey] === null) {
      field[fieldKey] = 1;
    } else if (field[fieldKey] === true) {
      field[fieldKey] = 2;
    } else if (field[fieldKey] === false) {
      field[fieldKey] = 3;
    }
  }

  onRowClickedAll(params) {
    this.selectedRowIdsAll = params.api.getSelectedRows().map(field => field.Id);
  }

  onPaginationClickedAll(params: { [key: string]: any }): void {
    if (params.newPage && this.checkedRowAll) {
      this.cleanSelectedRowAll();
    }
  }

  cleanSelectedRowAll(): void {
    this.checkedRowAll = false;
    this.selectedRowIdsAll.length = 0;
    this.agGrid.api.forEachNode((node) => node.setSelected(false));
  }

  onSelectAll(): void {
    if (this.checkedRowAll) {
      const currentPage = this.agGrid.api.paginationGetCurrentPage();

      this.agGrid.api.forEachNode((node) => {
        const skipCount = Math.floor(node.rowIndex / this.cacheBlockSize);
        node['selected'] = !node['selected'];
      });
      this.selectedRowIdsAll = this.agGrid.api.getSelectedRows().map(field => field.Id);
    } else {
      this.cleanSelectedRowAll();
    }
    this.gridApi.redrawRows();
  }

  getProviders() {
    this.apiService.apiPost('providers').subscribe(data => {
      if (data.Code === 0) {
        this.providers = data.Objects;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  async onBulkEditorOpen() {
    if (this.bulkEditorRef) {
      this.bulkEditorRef.clear();
    }

    const componentInstance = await import('./../bulk-editor/bulk-editor.component').then(c => c.BulkEditorComponent);
    const componentRef = this.bulkEditorRef.createComponent(componentInstance);
    componentRef.instance.bulkMenuTrigger = this.bulkMenuTrigger;
    componentRef.instance.filterData = this.filterData;
  }

  exportToCsv() {
    this.apiService.apiPost('/competitions/exportcompetitions').pipe(take(1)).subscribe((data) => {
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

  goToCompetition(ev) {
    const url = this.router.serializeUrl(this.router.createUrlTree([`/main/sportsbook/competitions/competition/main`],
      {
        queryParams: {
          competitionId: ev.data?.CompetitionId || ev.data?.Id,
          sportId: ev.data?.SportId,
          partnerId: ev.data?.PartnerId,
          name: ev.data?.Name
        }
      }));
    if (url) {
      window.open(url, '_blank');
    } else {
      console.error('Failed to construct URL');
    }
  }

  async onMigrate() {
    const { MigrateCompetitionComponent } = await import('../../competitions/migrate-competition/migrate-competition.component');
    const dialogRef = this.dialog.open( MigrateCompetitionComponent, { width: ModalSizes.MIDDLE, data: this.agGrid.api.getSelectedRows()[0] });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getCurrentPage();
      }
    })
  }

}
