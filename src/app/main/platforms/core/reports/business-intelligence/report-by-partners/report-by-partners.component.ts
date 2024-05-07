import { Component, Injector, OnInit, ViewChild } from '@angular/core';

import { AgGridAngular } from "ag-grid-angular";
import { Controllers, GridMenuIds, GridRowModelTypes, Methods } from "../../../../../../core/enums";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from "rxjs/operators";

import { CommonDataService, ConfigService } from "../../../../../../core/services";
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import { BasePaginatedGridComponent } from "../../../../../components/classes/base-paginated-grid-component";
import { CoreApiService } from "../../../services/core-api.service";
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import {ExportService} from "../../../services/export.service";

@Component({
  selector: 'app-report-by-partners',
  templateUrl: './report-by-partners.component.html',
  styleUrls: ['./report-by-partners.component.scss']
})
export class ReportByPartnersComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public fromDate = new Date();
  public toDate = new Date();
  public clientData = {};
  public partners = [];
  public partnerId;
  public providers = [];
  public playerCurrency;
  public selectedItem = 'today';


  constructor(private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    private exportService:ExportService,
    protected injector: Injector) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_BUISNEES_INTELIGANCE_PARTNERS;
    this.columnDefs = [
      {
        headerName: 'Partners.PartnerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
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
        field: 'TotalBetAmount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        valueFormatter: params => params.data.TotalBetAmount?.toFixed(2),
      },
      {
        headerName: 'Dashboard.TotalWinsAmount',
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
        valueFormatter: params => params.data.TotalWinAmount?.toFixed(2),
      },
      {
        headerName: 'Dashboard.TotalGGR',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalGGR',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        valueFormatter: params => params.data.TotalGGR?.toFixed(2),
      },
    ]
  }

  ngOnInit(): void {
    this.setTime();
    this.playerCurrency = JSON.parse(localStorage.getItem('user'))?.CurrencyId;
    this.partners = this.commonDataService.partners;
    this.getData();
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

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
    syncColumnSelectPanel();
  }

  getData() {
    this.clientData = {
      FromDate: this.fromDate,
      ToDate: new Date(this.toDate.setDate(this.toDate.getDate() + 1))
    }
    this.apiService.apiPost(this.configService.getApiUrl, this.clientData, true,
      Controllers.REPORT, Methods.GET_REPORT_BY_PARTNERS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  exportToCsv() {

    this.exportService.exportToCsv( Controllers.REPORT, Methods.EXPORT_REPORT_BY_PARTNERS, { ...this.clientData, adminMenuId: this.adminMenuId });
  }

}
