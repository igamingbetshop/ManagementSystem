import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { take } from 'rxjs/operators';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { MatDialog } from "@angular/material/dialog";
import 'ag-grid-enterprise';
import { CommonDataService } from 'src/app/core/services';
import { Paging } from 'src/app/core/models';
import { GridMenuIds } from 'src/app/core/enums';
import { CellClickedEvent } from "ag-grid-community";
import { AgGridAngular } from "ag-grid-angular";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { SportsbookApiService } from '../../../../services/sportsbook-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.scss']
})

export class CompetitionsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  partners: any[] = [];
  providers: any[] = [];
  partnerId: number;
  masterDetail;
  rowData = [];
  categoryId: number;
  rowDataNested = [];
  name: string = "";
  path: string = 'competitions/categorycompetitions';
  nestedPath: string = 'competitions/settings';
  checkedRowAll: boolean = false;
  isDisabled = true;
  frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
  };

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
          valueGetter: (params) => {
            return params?.data?.Enabled ? 'Active' : 'Inactive';
          }
        },
        {
          headerName: 'Bonuses.Priority',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Priority',
          resizable: true,
          sortable: true,
          editable: false,
        },
        {
          headerName: 'Sport.AbsoluteLimit',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'AbsoluteLimit',
          resizable: true,
          sortable: true,
          editable: false,
        },
        {
          headerName: 'Sport.Delay',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Delay',
          resizable: true,
          sortable: true,
          editable: false,
        },
        {
          headerName: 'Sport.MaxWinPrematchSingle',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'MaxWinPrematchSingle',
          resizable: true,
          sortable: true,
          editable: false,
        },
        {
          headerName: 'Sport.MaxWinPrematchMultiple',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'MaxWinPrematchMultiple',
          resizable: true,
          sortable: true,
          editable: false,
        },
        {
          headerName: 'Sport.MaxWinLiveSingle',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'MaxWinLiveSingle',
          resizable: true,
          sortable: true,
          editable: false,
        },
        {
          headerName: 'Sport.MaxWinLiveMultiple',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'MaxWinLiveMultiple',
          resizable: true,
          sortable: true,
          editable: false,
        },
        {
          headerName: 'Products.CategoryId',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'CategoryId',
          resizable: true,
          sortable: true,
          editable: false,
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
    private activateRoute: ActivatedRoute,
    public commonDataService: CommonDataService,
  ) {
    super(injector);
    // this.adminMenuId = GridMenuIds.SP_COMPETITONS_ALL;
    this.columnDefs = [
      // {
      //   field: '',
      //   minWidth: 50,
      //   maxWidth: 50,
      //   checkboxSelection: true,
      //   headerCheckboxSelection: true,
      //   filter: false,
      //   menuTabs: false
      // },
      {
        headerName: 'Sport.CompetitionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        minWidth: 140,
        cellRenderer: 'agGroupCellRenderer',
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500', 'margin-top': '6px' },
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
        editable: false,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.AbsoluteLimit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AbsoluteLimit',
        resizable: true,
        sortable: true,
        editable: false,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.Delay',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Delay',
        resizable: true,
        sortable: true,
        editable: false,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.MaxWinPrematchSingle',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxWinPrematchSingle',
        resizable: true,
        sortable: true,
        editable: false,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.MaxWinPrematchMultiple',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxWinPrematchMultiple',
        resizable: true,
        sortable: true,
        editable: false,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.MaxWinLiveSingle',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxWinLiveSingle',
        resizable: true,
        sortable: true,
        editable: false,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.MaxWinLiveMultiple',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxWinLiveMultiple',
        resizable: true,
        sortable: true,
        editable: false,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Enabled',
        resizable: true,
        sortable: true,
        filter: 'agBooleanColumnFilter',
        valueGetter: (params) => {
          return params?.data?.Enabled ? 'Active' : 'Inactive';
        }
      },
      {
        headerName: 'Partners.Rating',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Rating',
        resizable: true,
        sortable: true,
        editable: false,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Products.CategoryId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CategoryId',
        resizable: true,
        sortable: true,
        editable: false,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
        resizable: true,
        sortable: true,
        editable: false,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
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
    this.name = this.activateRoute.snapshot.queryParams.name;
    this.categoryId = +this.activateRoute.snapshot.queryParams.categoryId;
    this.gridStateName = 'competitions-grid-state';
    this.getProviders();
  }

  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.PageIndex = this.paginationPage - 1;
        paging.PageSize = Number(this.cacheBlockSize);
        paging.PartnerId = this.partnerId;
        paging.CategoryId = this.categoryId;
        this.setSort(params.request.sortModel, paging, "OrderByDescending");
        this.setFilter(params.request.filterModel, paging);
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

  getProviders() {
    this.apiService.apiPost('providers').subscribe(data => {
      if (data.Code === 0) {
        this.providers = data.Objects;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
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

}
