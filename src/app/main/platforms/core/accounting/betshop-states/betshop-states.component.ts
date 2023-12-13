import { Component, OnInit, Injector } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MatSnackBar } from "@angular/material/snack-bar";
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';

import { Controllers, GridMenuIds, Methods } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { Paging } from 'src/app/core/models';
import { CoreApiService } from '../../services/core-api.service';
import { CommonDataService } from 'src/app/core/services';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import {CellEditingStoppedEvent} from "ag-grid-community";

@Component({
  selector: 'app-betshop-states',
  templateUrl: './betshop-states.component.html',
  styleUrls: ['./betshop-states.component.scss']
})
export class BetshopStatesComponent extends BasePaginatedGridComponent implements OnInit {
  public rowData = [];
  public detailedRowData = [];
  public partners: any[] = [];
  private PartnerId;
  masterDetail;
  private cashDeskStatesEnum;
  currentId: string | number

  public detailCellRendererParams: any = {
    // provide the Grid Options to use on the Detail Grid
    detailGridOptions: {
      // rowHeight: 47,
      // rowStyle: { color: 'white' },
      defaultColDef: {
        sortable: true,
        filter: true,
        flex: 1,
      },

      columnDefs: [
        {
          headerName: 'Common.Id',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Id',
          cellStyle: { color: '#076192' }
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
          headerName: 'Common.State',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'State',
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
          headerName: 'Common.Balance',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Balance',
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
          headerName: 'Clients.CreationTime',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'CreationTime',
          sortable: true,
          filter: 'agDateColumnFilter',
          cellRenderer: function (params) {
            let datePipe = new DatePipe("en-US");
            let dat = datePipe.transform(params.data.CreationTime, 'medium');
            return `${dat}`;
          },
          filterParams: {
            buttons: ['apply', 'reset'],
            closeOnApply: true,
            filterOptions: this.filterService.numberOptions
          },
        },


      ],
      onGridReady: params => {
        // params.api.setDomLayout('autoHeight');
      },
    },
    // get the rows for each Detail Grid
    getDetailRowData: params => {

      if (params) {

        this.apiService.apiPost(this.configService.getApiUrl, {
          BetShopId: params.data.Id,
        }, true, Controllers.BET_SHOP, Methods.GET_CASH_DESKS)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              const nestedRowData = data.ResponseObject.Entities;
              nestedRowData.forEach(row => {
                let cashDeskName = this.cashDeskStatesEnum.find((cashDesk) => {
                  return cashDesk.Id == row.State;
                })
                if (cashDeskName) {
                  row['State'] = cashDeskName.Name;
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
    protected injector: Injector,
    public commonDataService: CommonDataService,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.BETSHOP_STATES;
    this.columnDefs = [
      {
        field: 'Id',
        sortable: true,
        resizable: true,
        tooltipField: 'Id',
        cellRenderer: 'agGroupCellRenderer',
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
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
        }
      },
      {
        headerName: 'Common.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
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
        headerName: 'Common.Address',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Address',
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
        headerName: 'Common.PartnerName',
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
        headerName: 'Common.Balance',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Balance',
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
        headerName: 'Common.Current Limit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrentLimit',
        editable: true,
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },

    ];
    this.masterDetail = true;
  }

  ngOnInit() {
    this.partners = this.commonDataService.partners;
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_CASH_DESKS_STATES_ENUM)
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.cashDeskStatesEnum = data.ResponseObject;
        }
      })
    this.gridStateName = 'betshop-states-grid-state';
  }

  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  onCellEditingStopped(event: CellEditingStoppedEvent) {
    const CurrentLimit = event.value;
    const BetShopId = this.currentId
    const request = { BetShopId, CurrentLimit };
    this.apiService.apiPost(this.configService.getApiUrl, request,
      true, Controllers.BET_SHOP, Methods.CHANGE_BETSHOP_LIMIT).subscribe(data => {
        if (data.ResponseCode === 0) {
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  onCellClicked(event) {
    this.currentId = event.data.Id;
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        // paging.TakeCount = this.cacheBlockSize;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.PartnerId = this.PartnerId;


        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost(this.configService.getApiUrl, paging, true,
          Controllers.BET_SHOP, Methods.GET_BETS_SHOPS)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              params.success({ rowData: data.ResponseObject.Entities, rowCount: data.ResponseObject.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      },
    };
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

  onPartnerChange(val) {
    this.PartnerId = val;
    this.getCurrentPage();
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    setTimeout(() => {
      this.gridApi.refreshServerSide({purge:true});
    }, 100);  }

}
