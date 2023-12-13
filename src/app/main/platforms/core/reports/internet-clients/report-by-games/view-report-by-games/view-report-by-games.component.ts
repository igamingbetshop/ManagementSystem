import {Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CoreApiService} from "../../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BasePaginatedGridComponent} from "../../../../../../components/classes/base-paginated-grid-component";
import {Paging} from "../../../../../../../core/models";
import {Controllers, Methods} from "../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-view-report-by-games',
  templateUrl: './view-report-by-games.component.html',
  styleUrls: ['./view-report-by-games.component.scss']
})
export class ViewReportByGamesComponent extends BasePaginatedGridComponent implements OnInit {
  public id;
  public rowData;
  public filteredData;
  public fromDate = new Date();
  public toDate = new Date();

  constructor(private activateRoute: ActivatedRoute,
              private apiService: CoreApiService,
              public configService: ConfigService,
              private _snackBar: MatSnackBar,
              public commonDataService: CommonDataService,
              protected injector: Injector) {
    super(injector);
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
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Currency',
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
        headerName: 'Dashboard.BalancBefore',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BalanceBefore',
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
        headerName: 'Dashboard.Deposit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Deposit',
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
        headerName: 'Payments.Withdrawals',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Withdrawals',
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
        headerName: 'SkillGames.BetAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetAmount',
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
        headerName: 'Common.WinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'WinAmount',
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
        headerName: 'Dashboard.BalanceAdjustment',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BalanceAdjustment',
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
        headerName: 'Payments.BalanceAfter',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BalanceAfter',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
    ]
  }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;
    this.toDate = new Date(this.toDate.setDate(this.toDate.getDate() + 1));
  }

  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {

        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = this.cacheBlockSize;
        paging.BetDateFrom = this.fromDate;
        paging.BetDateBefore = this.toDate;
        paging.ProductIds = {
          ApiOperationTypeList: [{IntValue: +this.id, OperationTypeId: 1}],
          IsAnd: true
        }
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;
        this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
          Controllers.DASHBOARD, Methods.GET_CLIENTS_INFO_LIST).pipe(take(1)).subscribe(data => {
          if (data.ResponseCode === 0) {
            this.rowData = data.ResponseObject.Clients.Entities;
            params.success({rowData: this.rowData, rowCount: data.ResponseObject.Clients.Count});
          } else {
            SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
          }
          setTimeout(() => {this.gridApi.sizeColumnsToFit();}, 200);
        });
      },
    };
  }
}
