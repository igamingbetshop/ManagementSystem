import { Component, OnInit, Injector } from '@angular/core';
import { IServerSideDatasource } from 'ag-grid-community';
import { take } from 'rxjs/operators';
import { Controllers, GridMenuIds, Methods } from 'src/app/core/enums';
import 'ag-grid-enterprise';
import { Paging } from 'src/app/core/models';
import { CommonDataService } from 'src/app/core/services';
import { DatePipe } from '@angular/common';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CoreApiService } from '../../services/core-api.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import {ExportService} from "../../services/export.service";

@Component({
  selector: 'app-betshop-calculation',
  templateUrl: './betshop-calculation.component.html',
  styleUrls: ['./betshop-calculation.component.scss']
})
export class BetshopCalculationComponent extends BasePaginatedGridComponent implements OnInit {

  public rowData: IServerSideDatasource[] = [];

  public partnerId: number = 0;
  public betshopObj: any = {};

  public partners: any[] = [];
  public betshops: any[] = [];

  public filter = {};

  public amount: number = 0;
  public filteredData;

  constructor(
    protected injector: Injector,
    public commonDataService: CommonDataService,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private exportService:ExportService
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.BETSHOP_CALCULATION;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        sortable: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.UserId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserId',
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
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
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
        headerName: 'Clients.BetShopId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetShopId',
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
        headerName: 'Clients.BetShop',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetshopName',
        resizable: true,
        sortable: true,
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
        field: 'BetShopAvailiableBalance',
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
        headerName: 'Payments.Amount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Amount',
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
        headerName: 'Payments.Date',
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
    ];
  }

  ngOnInit() {
    this.gridStateName = 'betshop-calculation-grid-state';
    this.partners = this.commonDataService.partners;
  }

  onPartnerChange(val) {
    this.partnerId = val;
    this.filter["PartnerIds"] = {
      IsAnd: true,
      ApiOperationTypeList: [{ "IntValue": val, "OperationTypeId": 1 }]
    };
    this.apiService.apiPost(this.configService.getApiUrl, this.filter, true,
      Controllers.BET_SHOP, Methods.GET_BET_SHOPS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.betshops = data.ResponseObject.Entities.map(betshop => {
            return { Id: betshop.Id, Name: betshop.Name, CurrencyId: betshop.CurrencyId };
          });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  onBetshopChange(obj) {
    this.betshopObj = obj;
  }

  submit() {
    this.apiService.apiPost(this.configService.getApiUrl, {
      BetShopId: this.betshopObj.Id,
      Amount: this.amount,
      CurrencyId: this.betshopObj.CurrencyId,
    }, true, Controllers.PARTNER, Methods.PAY_BET_SHOP_DEBT)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;

          this.rowData.unshift(data.ResponseObject);
          this.getCurrentPage();
          // this.gridApi.setServerSideDatasource(this.rowData);

          // this.rowData.forEach(d => {
          //   let BetshopName = this.partners.find((partner) => {
          //     return partner.Id == entity.PartnerId;
          //   })
          //   if(partnerName){
          //     entity['PartnerId'] = partnerName.Name;
          //   }
          // })
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.betshopObj = {};
        this.amount = 0;
      })

  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
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

        this.apiService.apiPost(this.configService.getApiUrl, paging, true,
          Controllers.REPORT, Methods.GET_BETS_SHOP_RECONINGS)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              this.rowData.forEach(row =>{
                let BetshopNam = this.betshops.find((bet) => {
                  return bet.Id == row['BetShopId'];
                })
                if(BetshopNam){
                  row['BetshopName'] = BetshopNam.Name;
                }
              });
              params.success({ rowData: data.ResponseObject.Entities, rowCount: data.ResponseObject.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      },
    };
  }

  exportToCsv() {
    this.exportService.exportToCsv( Controllers.REPORT, Methods.EXPORT_BET_SHOP_RECONINGS, {...this.filteredData, adminMenuId: this.adminMenuId});
  }
}
