import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {Controllers, GridMenuIds, GridRowModelTypes, Methods} from "../../../../../../core/enums";
import {take} from "rxjs/operators";
import {BasePaginatedGridComponent} from "../../../../../components/classes/base-paginated-grid-component";
import {AgGridAngular} from "ag-grid-angular";
import {ActivatedRoute} from "@angular/router";
import {CoreApiService} from "../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-report-by-providers',
  templateUrl: './report-by-providers.component.html',
  styleUrls: ['./report-by-providers.component.scss']
})
export class ReportByProvidersComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public fromDate = new Date();
  public toDate = new Date();
  public clientData = {};
  public partnerId;
  public providers = [];
  public playerCurrency;
  public selectedItem = 'today';
  public partners = [];

  constructor(private activateRoute: ActivatedRoute,
              private apiService: CoreApiService,
              public configService: ConfigService,
              private _snackBar: MatSnackBar,
              public commonDataService: CommonDataService,
              protected injector: Injector) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_BUISNEES_INTELIGANCE_PROVIDERS;
    this.columnDefs = [
      {
        headerName: 'Partners.PartnerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
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
        headerName: 'Clients.ProviderName',
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
        headerName: 'Segments.TotalBetsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetsCount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        valueFormatter: params => params.data.TotalBetsCount?.toFixed(2),
      },
      {
        headerName: 'Segments.TotalBetsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetsAmount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        valueFormatter: params => params.data.TotalBetsAmount?.toFixed(2),
      },
      {
        headerName: 'Dashboard.TotalWinsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalWinsAmount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        valueFormatter: params => params.data.TotalWinsAmount?.toFixed(2),
      },
      {
        headerName: 'Dashboard.TotalUncalculatedBetsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalUncalculatedBetsCount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        valueFormatter: params => params.data.TotalWinsAmount?.toFixed(2),
      },
      {
        headerName: 'Dashboard.TotalUncalculatedBetsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalUncalculatedBetsAmount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        valueFormatter: params => params.data.TotalWinsAmount?.toFixed(2),
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
        valueFormatter: params => params.data.GGR?.toFixed(2),
      },
      {
        headerName: 'Dashboard.BetsCountPercent',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetsCountPercent',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        valueFormatter: params => params.data.BetsCountPercent?.toFixed(2),
      },
      {
        headerName: 'Dashboard.BetsAmountPercent',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetsAmountPercent',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        valueFormatter: params => params.data.BetsAmountPercent?.toFixed(2),
      },
      {
        headerName: 'Dashboard.GGRPercent',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GGRPercent',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        valueFormatter: params => params.data.GGRPercent?.toFixed(2),
      },
    ]
  }

  ngOnInit(): void {
    this.startDate();
    this.playerCurrency = JSON.parse(localStorage.getItem('user'))?.CurrencyId;
    this.partners = this.commonDataService.partners;
    this.getData();
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
    this.getData();
  }

  onStartDateChange(event) {
    this.fromDate = event.value;
  }

  onEndDateChange(event) {
    this.toDate = event.value;
  }

  getByPartnerData(event) {
    this.partnerId = event;
    this.getData();
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
    syncColumnSelectPanel();
  }


  getData() {
    this.clientData = {
      FromDate: this.fromDate,
      ToDate: this.toDate
    }

    if (this.partnerId) {
      this.clientData['PartnerId'] = this.partnerId;
    };

    this.apiService.apiPost(this.configService.getApiUrl, this.clientData, true,
      Controllers.REPORT, Methods.GET_REPORT_BY_PROVIDERS).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.rowData = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
      setTimeout(() => {this.gridApi.sizeColumnsToFit();}, 200);
    });
  }

  exportToCsv() {
    this.apiService.apiPost(this.configService.getApiUrl,{ ...this.clientData, adminMenuId: this.adminMenuId}, true,
      Controllers.REPORT, Methods.EXPORT_PROVIDERS).pipe(take(1)).subscribe((data) => {
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
