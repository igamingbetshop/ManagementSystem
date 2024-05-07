import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Controllers, GridMenuIds, GridRowModelTypes, Methods } from "../../../../../../core/enums";
import { AgGridAngular } from "ag-grid-angular";
import { BasePaginatedGridComponent } from "../../../../../components/classes/base-paginated-grid-component";
import { CoreApiService } from "../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../core/services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from "rxjs/operators";
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-report-by-providers',
  templateUrl: './report-by-providers.component.html',
  styleUrls: ['./report-by-providers.component.scss']
})
export class ReportByProvidersComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  rowData = [];
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  fromDate = new Date();
  toDate = new Date();
  clientData = {};
  partners = [];
  partnerId;
  selectedItem = 'today';
  providers = [];
  defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    minWidth: 50,
  };

  constructor(
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    protected injector: Injector) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_PROVIDERS;
    this.columnDefs = [
      {
        headerName: 'Products.GameProviderName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameProviderName',
      },
      {
        headerName: 'Providers.SubProviderName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SubProviderName',
      },
      {
        headerName: 'Segments.TotalBetsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetsAmount',
        valueFormatter: params => params.data.TotalBetsAmount.toFixed(2),
      },
      {
        headerName: 'Dashboard.TotalWinsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalWinsAmount',
        valueFormatter: params => params.data.TotalWinsAmount.toFixed(2),
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Dashboard.TotalGGR',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalGGR',
        valueFormatter: params => params.data.TotalGGR.toFixed(2),
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Dashboard.TotalBetsAmountFromBetShop',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetsAmountFromBetShop',
        valueFormatter: params => params.data.TotalBetsAmountFromBetShop.toFixed(2),
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Dashboard.TotalBetsAmountFromInternet',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetsAmountFromInternet',
        valueFormatter: params => params.data.TotalBetsAmountFromInternet.toFixed(2),
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Segments.TotalBetsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetsCount',
        valueFormatter: params => params.data.TotalBetsCount.toFixed(2),
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Dashboard.TotalPlayersCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalPlayersCount',
        valueFormatter: params => params.data.TotalPlayersCount.toFixed(2),
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
    this.getProviders();
  }

  onGridReady(params) {
    syncColumnReset();
    super.onGridReady(params);
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    if (event.partnerId) {
      this.partnerId = event.partnerId;
    } else {
      this.partnerId = null;
    }
    this.getData();
  }

  getData() {
    this.clientData = {
      FromDate: this.fromDate,
      ToDate: this.toDate
    };
    if (this.partnerId) {
      this.clientData['PartnerId'] = this.partnerId
    };
    this.apiService.apiPost(this.configService.getApiUrl, this.clientData, true,
      Controllers.DASHBOARD, Methods.GET_PROVIDER_BETS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject.Bets.map((items) => {
            items.ProviderName = this.providers.find((item => item.Id === items.ProviderId))?.Name;
            return items;
          });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getProviders() {
    this.apiService.apiPost(this.configService.getApiUrl, this.clientData, true,
      Controllers.PRODUCT, Methods.GET_GAME_PROVIDERS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.providers = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

}
