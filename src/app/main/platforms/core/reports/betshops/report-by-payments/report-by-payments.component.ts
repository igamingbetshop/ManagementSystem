import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { Controllers, GridMenuIds, GridRowModelTypes, Methods } from "../../../../../../core/enums";
import { ActivatedRoute } from "@angular/router";
import { CoreApiService } from "../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../core/services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BasePaginatedGridComponent } from "../../../../../components/classes/base-paginated-grid-component";
import { take } from "rxjs/operators";
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import {ExportService} from "../../../services/export.service";
import { formatDateTime } from 'src/app/core/utils';

@Component({
  selector: 'app-report-by-payments',
  templateUrl: './report-by-payments.component.html',
  styleUrls: ['./report-by-payments.component.scss']
})
export class ReportByPaymentsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  fromDate: any;
  public toDate: any;
  public clientData;
  public partners = [];
  public partnerId;
  public selectedItem = 'today';

  constructor(private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    private exportService:ExportService,
    protected injector: Injector) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_BETSHOPS_PAYMENTS;
    this.columnDefs = [
      {
        headerName: 'BetShops.BetShopId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
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
        headerName: 'Common.GroupId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GroupId',
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
        headerName: 'Clients.BetShopName',
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
        },
      },
      {
        headerName: 'Dashboard.PendingDepositsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalPendingDepositsCount',
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
        headerName: 'Dashboard.PendingDepositsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalPendingDepositsAmount',
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
        headerName: 'Dashboard.PayedDepositsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalPayedDepositsCount',
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
        headerName: 'Dashboard.PayedDepositsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalPayedDepositsAmount',
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
        headerName: 'Dashboard.CanceledDepositsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalCanceledDepositsCount',
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
        headerName: 'Dashboard.CanceledDepositsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalCanceledDepositsAmount',
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
        headerName: 'Dashboard.PendingWithdrawalsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalPendingWithdrawalsCount',
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
        headerName: 'Dashboard.PendingWithdrawalsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalPendingWithdrawalsAmount',
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
        headerName: 'Dashboard.PayedWithdrawalsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalPayedWithdrawalsCount',
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
        headerName: 'Dashboard.PayedWithdrawalsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalPayedWithdrawalsAmount',
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
        headerName: 'Dashboard.CanceledWithdrawalsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalCanceledWithdrawalsCount',
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
        headerName: 'Dashboard.CanceledWithdrawalsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalCanceledWithdrawalsAmount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
    ]
  }

  ngOnInit(): void {
    this.setTime();
    this.partners = this.commonDataService.partners;
    this.getData();
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = formatDateTime(fromDate);
    this.toDate = formatDateTime(toDate);    
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnSelectPanel();
    syncColumnReset();
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.partnerId = event.partnerId ? event.partnerId : null;
    this.getData();
  }

  getData() {
    this.clientData = {
      FromDate: this.fromDate,
      ToDate: this.toDate,
    };
    if (this.partnerId) {
      this.clientData.PartnerId = this.partnerId
      };
    
    this.apiService.apiPost(this.configService.getApiUrl, this.clientData, true,
      Controllers.REPORT, Methods.GET_REPORT_BY_BET_SHOP_PAYMENTS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getByPartnerData(event) {
    this.partnerId = event;
    this.getData();
  }

  exportToCsv() {
    this.exportService.exportToCsv( Controllers.REPORT, Methods.EXPORT_BY_BET_SHOP_PAYMENTS, { ...this.clientData, adminMenuId: this.adminMenuId });
  }

}
