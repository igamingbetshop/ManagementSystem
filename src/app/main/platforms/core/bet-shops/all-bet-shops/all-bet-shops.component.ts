import { Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CommonDataService } from 'src/app/core/services';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { CoreApiService } from '../../services/core-api.service';
import 'ag-grid-enterprise';
import { Paging } from 'src/app/core/models';
import { Controllers, Methods, ModalSizes } from 'src/app/core/enums';
import { take } from 'rxjs/operators';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';
import {ExportService} from "../../services/export.service";

@Component({
  selector: 'app-all-bet-shops',
  templateUrl: './all-bet-shops.component.html',
  styleUrls: ['./all-bet-shops.component.scss']
})
export class AllBetShopsComponent extends BasePaginatedGridComponent implements OnInit {

  rowData = [];
  name: string;
  betId: string;
  partners: any[] = [];
  betShopStates: any[] = [];
  filteredData;
  frameworkComponents = {
    agDropdownFilter: AgDropdownFilter,
  };

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    public dialog: MatDialog,
    private activateRoute: ActivatedRoute,
    private exportService:ExportService
  ) {
    super(injector);


  }

  ngOnInit() {
    this.getBetShopStatesEnum();
    this.name = this.activateRoute.snapshot.queryParams.Name;
    this.betId = this.activateRoute.snapshot.queryParams.BetId;
    this.partners = this.commonDataService.partners;
    this.getCurrentPage();
  }

  getBetShopStatesEnum() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_BET_SHOP_STATES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.betShopStates = data.ResponseObject;
          this.setColumDefs();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  setColumDefs() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.GroupName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GroupName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
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
        }
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.Address',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Address',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.AgentId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AgentId',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: true,
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.betShopStates,
        },
      },
      {
        headerName: 'BetShops.CurrentLimit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrentLimit',
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
        headerName: 'BetShops.MaxCopyCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxCopyCount',
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
        headerName: 'BetShops.MaxWinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxWinAmount',
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
        headerName: 'BetShops.MinBetAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MinBetAmount',
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
        headerName: 'BetShops.MaxEventCountPerTicket',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxEventCountPerTicket',
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
        headerName: 'BetShops.CommissionType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CommissionType',
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
        headerName: 'BetShops.CommisionRate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CommisionRate',
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
        headerName: 'BetShops.AnonymousBet',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AnonymousBet',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'BetShops.AllowCashout',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AllowCashout',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Sport.AllowLive',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AllowLive',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'BetShops.UsePin',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UsePin',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          data.path = this.router.url.replace(replacedPart, 'bet-shop').split('?')[0];
          data.queryParams = { betShopId: params.data.Id };
          return data;
        },
        sortable: false
      },
    ];
  }

  async AddBetshop() {
    const { AddBetShopComponent } = await import('../add-bet-shop/add-bet-shop.component');
    const dialogRef = this.dialog.open(AddBetShopComponent, {
      width: ModalSizes.SMALL,
      data: { betshopstates: this.betShopStates }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getCurrentPage();
      }
    })
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnSelectPanel();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    setTimeout(() => { this.gridApi.setServerSideDatasource(this.createServerSideDatasource()); }, 0);
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);

        this.filteredData = paging;
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        paging.GroupIds = {
          IsAnd: true,
          ApiOperationTypeList: [{ "IntValue": this.betId, "OperationTypeId": 1 }]
        };
        this.apiService.apiPost(this.configService.getApiUrl, paging,
          true, Controllers.BET_SHOP, Methods.GET_BET_SHOPS).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities;
              mappedRows.forEach((entity) => {
                let partnerName = this.partners.find((partner) => {
                  return partner.Id == entity.PartnerId;
                })
                if (partnerName) {
                  entity['PartnerName'] = partnerName.Name;
                }

                let stateName = this.betShopStates.find((state) => {
                  return state.Id == entity.State;
                })
                if (stateName) {
                  entity['State'] = stateName.Name;
                }
              })
              params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      },
    };
  }

  exportToCsv()
  {
    this.exportService.exportToCsv( Controllers.BET_SHOP, Methods.EXPORT_BET_SHOPS, this.filteredData);
  }

}
