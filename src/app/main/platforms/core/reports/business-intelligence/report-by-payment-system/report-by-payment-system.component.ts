import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { ActivatedRoute } from "@angular/router";

import 'ag-grid-enterprise';
import { take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";

import { BasePaginatedGridComponent } from "../../../../../components/classes/base-paginated-grid-component";
import { CoreApiService } from "../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../core/services";
import { Controllers, GridMenuIds, GridRowModelTypes, Methods } from "../../../../../../core/enums";
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';

@Component({
  selector: 'app-report-by-payment-system',
  templateUrl: './report-by-payment-system.component.html',
  styleUrls: ['./report-by-payment-system.component.scss']
})
export class ReportByPaymentSystemComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public paymentRequestType = [];
  public fromDate = new Date();
  public toDate = new Date();
  public clientData = {};
  public filteredData;
  public partners = [];
  public partnerId;
  public selectedItem = 'today';
  public payments = [
    { Id: 1, Name: 'Withdraw' },
    { Id: 2, Name: 'Deposit' }
  ];
  public paymentId = 2;
  public detailCellRendererParams: any;
  public masterDetail;
  public detailsInline;
  private statusFilterArray = [];

  constructor(private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    protected injector: Injector) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_BUISNEES_INTELIGANCE_PAYMENT_SYSTEMS
    this.columnDefs = [
      {
        headerName: 'Partners.Partner',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        sortable: true,
        resizable: true,
        cellRenderer: 'agGroupCellRenderer',
        filter: false,
      },
      {
        headerName: 'Partners.PaymentSystem',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PaymentSystemName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Partners.Count',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Count',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StateName',
        sortable: true,
        resizable: true,
        filter: 'agSetColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          defaultToNothingSelected: true,
          values: this.statusFilterArray,
        },
      },
      {
        headerName: 'Common.TotalAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalAmount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
      },
    ];
    this.masterDetail = true;
    this.detailCellRendererParams = {
      detailGridOptions: {
        rowHeight: 47,
        defaultColDef: {
          sortable: true,
          filter: true,
          flex: 1,
        },
        columnDefs: [
          {
            headerName: 'Common.Segment Id',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'SegmentId',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Common.SegmentName',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'SegmentName',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Common.PaymentRequestCount',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'PaymentRequestCount',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Common.Total Amount',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'TotalAmount',
            sortable: true,
            resizable: true,
          },
        ],
        onGridReady: params => {
        },
      },
      getDetailRowData: params => {
        if (params) {
          let info = {
            FromDate: this.fromDate,
            ToDate: this.toDate,
            Type: this.paymentId,
            PartnerId: params.data.PartnerId,
            PaymentSystemId: params.data.PaymentSystemId,
            Status: params.data.Status
          }
          this.apiService.apiPost(this.configService.getApiUrl, info, true,
            Controllers.REPORT, Methods.GET_REPORT_BY_SEGMENT).pipe(take(1)).subscribe(data => {
              const nestedRowData = data.ResponseObject.BetSelections
              this.detailsInline = data.ResponseObject
              params.successCallback(nestedRowData);
            })
        }
      },
    }
  }

  ngOnInit(): void {
    this.setTime();  
    this.partners = this.commonDataService.partners;
    this.getPaymentSystemTypes();
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
    this.getReportByPaymentSystems();
  }


  getPaymentSystemTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_PAYMENT_REQUEST_STATES_ENUM).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.paymentRequestType = data.ResponseObject;
          this.mapStatusFilter();
          this.getReportByPaymentSystems();
        }
      });
  }

  getByPaymentData(event) {
    this.paymentId = event;
    this.getReportByPaymentSystems();
  }

  getReportByPaymentSystems() {
    this.clientData = {
      FromDate: this.fromDate,
      ToDate: this.toDate,
      PartnerId: this.partnerId,
      Type: this.paymentId
    }
    this.apiService.apiPost(this.configService.getApiUrl, this.clientData, true,
      Controllers.REPORT, Methods.GET_REPORT_BY_PAYMENT_SYSTEM).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject.Entities.map((items) => {
            items.StateName = this.paymentRequestType.find((item => item.Id === items.Status))?.Name;
            return items;
          });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  mapStatusFilter(): void {
    this.paymentRequestType.forEach(field => {
      this.statusFilterArray.push(field.Name);
    })
  }

}
