import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {Controllers, GridMenuIds, GridRowModelTypes, Methods} from "../../../../../../core/enums";
import {AgGridAngular} from "ag-grid-angular";
import {BasePaginatedGridComponent} from "../../../../../components/classes/base-paginated-grid-component";
import {ActivatedRoute} from "@angular/router";
import {CoreApiService} from "../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

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
  public partners = [];
  public partnerId;
  public selectedItem = 'today';
  public providers = [];

  constructor(private activateRoute: ActivatedRoute,
              private apiService: CoreApiService,
              public configService: ConfigService,
              private _snackBar: MatSnackBar,
              public commonDataService: CommonDataService,
              protected injector: Injector) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_PROVIDERS;
    this.columnDefs = [
      {
        headerName: 'Clients.ProviderName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProviderName',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Segments.TotalBetsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetsAmount',
        sortable: true,
        resizable: true,
        valueFormatter: params => params.data.TotalBetsAmount.toFixed(2),
      },
      {
        headerName: 'Dashboard.TotalWinsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalWinsAmount',
        sortable: true,
        resizable: true,
        valueFormatter: params => params.data.TotalWinsAmount.toFixed(2),
      },
      {
        headerName: 'Dashboard.TotalGGR',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalGGR',
        sortable: true,
        resizable: true,
        valueFormatter: params => params.data.TotalGGR.toFixed(2),
      },
      {
        headerName: 'Dashboard.TotalBetsAmountFromBetShop',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetsAmountFromBetShop',
        sortable: true,
        resizable: true,
        valueFormatter: params => params.data.TotalBetsAmountFromBetShop.toFixed(2),
      },
      {
        headerName: 'Dashboard.TotalBetsAmountFromInternet',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetsAmountFromInternet',
        sortable: true,
        resizable: true,
        valueFormatter: params => params.data.TotalBetsAmountFromInternet.toFixed(2),
      },
      {
        headerName: 'Segments.TotalBetsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetsCount',
        sortable: true,
        resizable: true,
        valueFormatter: params => params.data.TotalBetsCount.toFixed(2),
      },
      {
        headerName: 'Dashboard.TotalPlayersCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalPlayersCount',
        sortable: true,
        resizable: true,
        valueFormatter: params => params.data.TotalPlayersCount.toFixed(2),
      },
    ]
  }

  ngOnInit(): void {
    this.startDate();
    this.partners = this.commonDataService.partners;
    this.getProviders();
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

  onGridReady(params) {
    super.onGridReady(params);
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
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  getByPartnerData(event) {
    this.partnerId = event;
    this.getData();
  }

  getProviders() {
    this.apiService.apiPost(this.configService.getApiUrl, this.clientData, true,
      Controllers.PRODUCT, Methods.GET_GAME_PROVIDERS).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.providers = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

}
