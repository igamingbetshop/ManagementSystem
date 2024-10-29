import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Controllers, GridMenuIds, GridRowModelTypes, Methods } from "../../../../../../core/enums";
import { take } from "rxjs/operators";
import { BasePaginatedGridComponent } from "../../../../../components/classes/base-paginated-grid-component";
import { AgGridAngular } from "ag-grid-angular";
import { ActivatedRoute } from "@angular/router";
import { CoreApiService } from "../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../core/services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import {ExportService} from "../../../services/export.service";
import { formatDateTime } from 'src/app/core/utils';

@Component({
  selector: 'app-report-by-providers',
  templateUrl: './report-by-providers.component.html',
  styleUrls: ['./report-by-providers.component.scss']
})
export class ReportByProvidersComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  rowData = [];
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  fromDate: any;;
  toDate: any;
  clientData = {};
  partnerId;
  providers = [];
  playerCurrency;
  selectedItem = 'today';
  partners = [];
  agentId: any;
  title: string;
  defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    minWidth: 50,
  };
  constructor(private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    private exportService:ExportService,
    protected injector: Injector) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_BUISNEES_INTELIGANCE_PROVIDERS;
    this.columnDefs = [
      {
        headerName: 'Partners.PartnerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
      },
      {
        headerName: 'Clients.ProviderName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProviderName',
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Currency',
      },
      {
        headerName: 'Segments.TotalBetsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetsCount',
        // valueFormatter: params => params.data.TotalBetsCount?.toFixed(2),
      },
      {
        headerName: 'Segments.TotalBetsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetsAmount',
        // valueFormatter: params => params.data.TotalBetsAmount?.toFixed(2),
      },
      {
        headerName: 'Dashboard.TotalWinsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalWinsAmount',
        // valueFormatter: params => params.data.TotalWinsAmount?.toFixed(2),
      },
      {
        headerName: 'Dashboard.TotalUncalculatedBetsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalUncalculatedBetsCount',
        // valueFormatter: params => params.data.TotalWinsAmount?.toFixed(2),
      },
      {
        headerName: 'Dashboard.TotalUncalculatedBetsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalUncalculatedBetsAmount',
        // valueFormatter: params => params.data.TotalWinsAmount?.toFixed(2),
      },
      {
        headerName: 'Dashboard.GGR',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GGR',
        // valueFormatter: params => params.data.GGR?.toFixed(2),
      },
      {
        headerName: 'Dashboard.BetsCountPercent',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetsCountPercent',
        // valueFormatter: params => params.data.BetsCountPercent?.toFixed(2),
      },
      {
        headerName: 'Dashboard.BetsAmountPercent',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetsAmountPercent',
        // valueFormatter: params => params.data.BetsAmountPercent?.toFixed(2),
      },
      {
        headerName: 'Dashboard.GGRPercent',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GGRPercent',
        // valueFormatter: params => params.data.GGRPercent?.toFixed(2),
      },
    ]
  }

  ngOnInit(): void {
    this.setTime();
    this.agentId = +this.activateRoute.snapshot.queryParams.agentId;
    this.playerCurrency = JSON.parse(localStorage.getItem('user'))?.CurrencyId;
    this.partners = this.commonDataService.partners;
    this.getData();
    this.setTitle();
  }

  setTitle() {
    const title = this.translate.instant('Reports.ReportByProviders');
    const agent = this.translate.instant('Agents.Agents');
    !!this.agentId ? this.title = agent + ' / '  + title  + ' : ' + this.agentId :  this.title = 'Reports.ReportByProviders';
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = formatDateTime(fromDate);
    this.toDate = formatDateTime(toDate);    
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
    syncColumnSelectPanel();
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
      AgentId: this.agentId

    }

    if (this.partnerId) {
      this.clientData['PartnerId'] = this.partnerId;
    };

    this.apiService.apiPost(this.configService.getApiUrl, this.clientData, true,
      Controllers.REPORT, Methods.GET_REPORT_BY_PROVIDERS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
          this.rowData.forEach((items) => {
            items.TotalBetsAmount = items.TotalBetsAmount?.toFixed(2);
            items.TotalWinsAmount = items.TotalWinsAmount?.toFixed(2);
            items.TotalUncalculatedBetsAmount = items.TotalUncalculatedBetsAmount?.toFixed(2);
            items.GGR = items.GGR?.toFixed(2);
            items.BetsCountPercent = items.BetsCountPercent?.toFixed(2);
            items.BetsAmountPercent = items.BetsAmountPercent?.toFixed(2);
            items.GGRPercent = items.GGRPercent?.toFixed(2);
          });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  exportToCsv() {
    this.exportService.exportToCsv( Controllers.REPORT, Methods.EXPORT_PROVIDERS, { ...this.clientData, adminMenuId: this.adminMenuId });
  }

  onTitleClick(ev) {
    if(!!this.agentId) {
    this.router.navigate(['/main/platform/reports/agents/report-by-agents'], );
    }
    else {
      return;
    }
  }

}
