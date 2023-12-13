import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {BasePaginatedGridComponent} from "../../../../../components/classes/base-paginated-grid-component";
import {AgGridAngular} from "ag-grid-angular";
import {Controllers, GridMenuIds, GridRowModelTypes, Methods} from "../../../../../../core/enums";
import {ActivatedRoute} from "@angular/router";
import {CoreApiService} from "../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-report-by-deposit',
  templateUrl: './report-by-deposit.component.html',
  styleUrls: ['./report-by-deposit.component.scss']
})
export class ReportByDepositComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public fromDate = new Date();
  public toDate = new Date();
  public clientData = {};
  public partners = [];
  public paymentSystems = [];
  public paymentSystems2 = [];
  public partnerId;
  public selectedItem = 'today';
  public showTable = false;
  public nestedHeaders = [];
  public columnDefs2 = [];
  public columnDefs3 = [];

  constructor(private activateRoute: ActivatedRoute,
              private apiService: CoreApiService,
              public configService: ConfigService,
              private _snackBar: MatSnackBar,
              public commonDataService: CommonDataService,
              protected injector: Injector) {
    super(injector);
    // this.adminMenuId = GridMenuIds.CORE_REPORT_BY_ACOUNTING_DEPOSIT;
    this.columnDefs = [
      {
        headerName: 'Clients.ClientId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.NameSurname',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name_Surname',
        sortable: true,
        resizable: true,
        cellRenderer: params => {
          var a = document.createElement('div');
          if (params.data.FirstName !== null || params.data.LastName !== null) {
            a.innerHTML = params.data.FirstName + ' ' + params.data.LastName;
          }
          return a;
        },
      },
      {
        headerName: 'Common.Total',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'totalAmount',
        sortable: true,
        resizable: true,
      },
    ]
    this.columnDefs2 = [
      {
        headerName: 'Clients.ClientId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.NameSurname',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name_Surname',
        sortable: true,
        resizable: true,
        cellRenderer: params => {
          var a = document.createElement('div');
          if (params.data.FirstName !== null || params.data.LastName !== null) {
            a.innerHTML = params.data.FirstName + ' ' + params.data.LastName;
          }
          return a;
        },
      },
      {
        headerName: 'Common.Total',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'totalAmount',
        sortable: true,
        resizable: true,
      },
    ]
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  ngOnInit(): void {
    this.startDate();
    this.partners = this.commonDataService.partners;
    this.getPaymentSystems();
  }

  getPaymentSystems() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.PAYMENT, Methods.GET_PAYMENT_SYSTEMS).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.paymentSystems = data.ResponseObject;
      }
    });
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

  getData() {
    if (!this.partnerId) {
      return;
    } else {
      this.showTable = true;
      this.clientData = {
        FromDate: this.fromDate,
        ToDate: this.toDate,
        PartnerId: this.partnerId,
        Type: 2
      }
    }
    this.apiService.apiPost(this.configService.getApiUrl, this.clientData, true,
      Controllers.REPORT, Methods.GET_PARTNER_PAYMENTS_SUMMARY_REPORT).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        if (data.ResponseObject.PaymentRequests.PaymentMethods.length !== 0) {
          this.paymentSystems2 = data.ResponseObject.PaymentRequests.PaymentMethods.map((items) => {
            this.rowData = [];
            let a = {
              ClientId: this.columnDefs.find(o => o.field === 'ClientId'),
              Name_Surname: this.columnDefs.find(o => o.field === 'Name_Surname'),
              PaymentSystemId: items.PaymentSystemId,
              CurrencyId: items.CurrencyId,
              Name: this.paymentSystems.find((item) => {
                return item.Id === items.PaymentSystemId;
              }).Name,
              field: this.paymentSystems.find((item) => {
                return item.Id === items.PaymentSystemId;
              }).Name + " (" + items.CurrencyId + ")",
              headerName: this.paymentSystems.find((item) => {
                return item.Id === items.PaymentSystemId;
              }).Name + " (" + items.CurrencyId + ")",
            }
            this.columnDefs.push(a);
          })
          this.gridApi?.setColumnDefs(this.columnDefs);
          this.gridApi?.sizeColumnsToFit();
          this.nestedHeaders = data.ResponseObject.PaymentRequests.PaymentsInfo.forEach((i) => {
            i.totalAmount = 0;
            i.Payments.forEach((j) => {
              j.Name = this.paymentSystems.find((chr) => {
                return chr.Id === j.PaymentSystemId;
              }).Name
              i[j.Name + " (" + i.CurrencyId + ")"] = j.Amount;
              i.totalAmount += j.Amount;
            })
            this.rowData.push(i)
            this.gridApi?.setRowData(this.rowData);
          })
        } else {
          this.columnDefs = [];
          this.rowData = [];
          this.columnDefs = this.columnDefs2;
          this.gridApi?.setColumnDefs(this.columnDefs);
        }
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }


}
