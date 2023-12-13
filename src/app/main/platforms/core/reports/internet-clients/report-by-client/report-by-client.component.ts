import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {AgGridAngular} from "ag-grid-angular";
import {ActivatedRoute} from "@angular/router";
import {CoreApiService} from "../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BasePaginatedGridComponent} from "../../../../../components/classes/base-paginated-grid-component";
import 'ag-grid-enterprise';
import {Paging} from "../../../../../../core/models";
import {Controllers, GridMenuIds, Methods} from "../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";
import {DecimalPipe} from "@angular/common";
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';

@Component({
  selector: 'app-report-by-client',
  templateUrl: './report-by-client.component.html',
  styleUrls: ['./report-by-client.component.scss']
})
export class ReportByClientComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public fromDate = new Date();
  public toDate = new Date();
  public clientData = {};
  public filteredData;
  public partners = [];
  public status = [];
  public partnerId;
  public selectedItem = 'today';

  constructor(private activateRoute: ActivatedRoute,
              private apiService: CoreApiService,
              public configService: ConfigService,
              private _snackBar: MatSnackBar,
              public commonDataService: CommonDataService,
              protected injector: Injector) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_CLIENT;
    this.columnDefs = [
      {
        headerName: 'Clients.ClientId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
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
        headerName: 'Clients.Email',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Email',
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
        headerName: 'Clients.UserName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserName',
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
        headerName: 'Common.NameSurname',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FirstName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellRenderer: params => {
          var a = document.createElement('div');
          if (params.data.FirstName !== null || params.data.LastName !== null) {
            a.innerHTML = params.data.FirstName + ' ' + params.data.LastName;
          }
          return a;
        },
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
        },
      },
      {
        headerName: 'Dashboard.GGR',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GGR',
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
        headerName: 'Dashboard.NGR',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NGR',
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
        headerName: 'Dashboard.Deposit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DepositsCount',
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
        headerName: 'Dashboard.Withdrawals',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'WithdrawalsCount',
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
        headerName: 'SkillGames.BetAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetAmount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          let numberPipe = new DecimalPipe("en-US");
          let data = numberPipe.transform(params.data.TotalBetAmount, '1.2-2');
          return `${data}`;
        }
      },
      {
        headerName: 'Common.WinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalWinAmount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          let numberPipe = new DecimalPipe("en-US");
          let data = numberPipe.transform(params.data.TotalWinAmount, '1.2-2');
          return `${data}`;
        }
      },
      {
        headerName: 'Common.RealBalance',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RealBalance',
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.BonusBalance',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusBalance',
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Dashboard.CreditCorrection',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalCreditCorrection',
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
        headerName: 'Dashboard.DebitCorrection',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalDebitCorrection',
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
        headerName: 'Dashboard.Bonuses',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Bonuses',
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
        headerName: 'Clients.TotalDepositAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalDepositAmount',
        sortable: true,
        resizable: true,
        filter:false
      },
      {
        headerName: 'Clients.TotalWithdrawalAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalWithdrawalAmount',
        sortable: true,
        resizable: true,
        filter:false
      },
    ]
  }

  ngOnInit(): void {
    this.startDate();
    this.partners = this.commonDataService.partners;
  }

  startDate() {
    DateTimeHelper.startDate();
    this.fromDate = DateTimeHelper.getFromDate();
    this.toDate = DateTimeHelper.getToDate();
  }

  selectTime(time: string): void {
    DateTimeHelper.selectTime(time);
    this.fromDate = DateTimeHelper.getFromDate();
    this.toDate = DateTimeHelper.getToDate();
    this.selectedItem = time;
    this.getCurrentPage();
  }

  onStartDateChange(event) {
    this.fromDate = event.value;
  }

  onEndDateChange(event) {
    this.toDate = event.value;
  }



  getByPartnerData(event) {
    this.partnerId = event;
    this.gridApi?.setServerSideDatasource(this.createServerSideDatasource());
  }

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
        if (this.partnerId) {
          paging.PartnerId = this.partnerId;
          paging.SkipCount = this.paginationPage - 1;
          // paging.TakeCount = this.cacheBlockSize;
          paging.TakeCount = Number(this.cacheBlockSize);
          paging.FromDate = this.fromDate;
          paging.ToDate = this.toDate;
        } else {
          paging.SkipCount = this.paginationPage - 1;
          // paging.TakeCount = this.cacheBlockSize;
          paging.TakeCount = Number(this.cacheBlockSize);
          paging.FromDate = this.fromDate;
          paging.ToDate = this.toDate;
        }
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;
        this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
          Controllers.DASHBOARD, Methods.GET_CLIENTS_INFO_LIST).pipe(take(1)).subscribe(data => {
          if (data.ResponseCode === 0) {
            const mappedRows = data.ResponseObject.Clients.Entities.map((items) => {
              items.PartnerName = this.partners.find((item => item.Id === items.PartnerId))?.Name;
              items.StateName = this.status.find((item => item.Id === items.Status))?.Name;
              return items;
            });

            console.log(mappedRows, 'mappedRows');
            
            params.success({rowData: mappedRows, rowCount: data.ResponseObject.Clients.Count});
          } else {
            SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
          }
        });
      },
    };
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  exportToCsv() {
    this.apiService.apiPost(this.configService.getApiUrl, {...this.filteredData, adminMenuId: this.adminMenuId}, true,
      Controllers.DASHBOARD, Methods.EXPORT_CLIENTS_INFO_LIST).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        var iframe = document.createElement("iframe");
        iframe.setAttribute("src", this.configService.defaultOptions.WebApiUrl + '/' + data.ResponseObject.ExportedFilePath);
        iframe.setAttribute("style", "display: none");
        document.body.appendChild(iframe);
      }else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

}
