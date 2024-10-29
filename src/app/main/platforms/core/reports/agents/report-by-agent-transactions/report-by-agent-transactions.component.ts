import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { CoreApiService } from "../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../core/services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BasePaginatedGridComponent } from "../../../../../components/classes/base-paginated-grid-component";
import { Paging } from "../../../../../../core/models";
import { Controllers, GridMenuIds, Methods } from "../../../../../../core/enums";
import { take } from "rxjs/operators";
import 'ag-grid-enterprise';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { DecimalPipe } from "@angular/common";
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import {ExportService} from "../../../services/export.service";
import { formatDateTime } from 'src/app/core/utils';

@Component({
  selector: 'app-report-by-agent-transactions',
  templateUrl: './report-by-agent-transactions.component.html',
  styleUrls: ['./report-by-agent-transactions.component.scss']
})
export class ReportByAgentTransactionsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  fromDate: any;
  public toDate: any;
  public clientData = {};
  public filteredData;
  public selectedItem;
  public partnerId;
  public partners = [];
  operationTypesArray = [];
  operationTypesEnum;

  constructor(
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    private exportService:ExportService,
    protected injector: Injector) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_AGENTS_TRANSACTIONS;
    this.getOperationTypesEnum();
    this.columnDefs = [
      {
        headerName: 'Common.Id',
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
        headerName: 'Common.OperationType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OperationType',
        sortable: true,
        resizable: true,
        filter: 'agSetColumnFilter',
        filterParams: {
          // values: this.operationTypesArray,
          values: this.operationTypesEnum,
        }
      },
      // {
      //   headerName: 'Common.Type',
      //   headerValueGetter: this.localizeHeader.bind(this),
      //   field: 'Type',
      //   sortable: true,
      //   resizable: true,
      //   filter: 'agTextColumnFilter',
      //   filterParams: {
      //     buttons: ['apply', 'reset'],
      //     closeOnApply: true,
      //     filterOptions: this.filterService.textOptions
      //   },
      // },
      // {
      //   headerName: 'Partners.PartnerName',
      //   headerValueGetter: this.localizeHeader.bind(this),
      //   field: 'PartnerName',
      //   sortable: true,
      //   resizable: true,
      //   filter: 'agTextColumnFilter',
      //   filterParams: {
      //     buttons: ['apply', 'reset'],
      //     closeOnApply: true,
      //     filterOptions: this.filterService.textOptions
      //   },
      // },
      {
        headerName: 'Clients.UserId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserId',
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
        headerName: 'Dashboard.Amount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Amount',
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
        headerName: 'Common.LastUpdateTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      }
    ]
  }

  ngOnInit(): void {
    this.setTime();
    this.partners = this.commonDataService.partners;
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = formatDateTime(fromDate);
    this.toDate = formatDateTime(toDate);    
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.partnerId = event.partnerId ? event.partnerId : null;
    this.getCurrentPage();
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
    syncColumnSelectPanel();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;

        if (this.partnerId) {
          paging.PartnerId = this.partnerId;
        }
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;
        this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
          Controllers.AGENT, Methods.GET_TRANSACTIONS).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities;

              this.rowData = mappedRows;
              mappedRows.forEach((entity) => {
                let operationType = this.operationTypesEnum?.find((operation) => {
                  return operation.Id == entity.OperationTypeId;
                })
                if (operationType) {
                  entity['OperationType'] = operationType.Name;
                }
              })
              params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      },
    };
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    setTimeout(() => { this.gridApi.setServerSideDatasource(this.createServerSideDatasource()); }, 0);
  }

  getOperationTypesEnum() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_OPERATION_TYPES_ENUM).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        // let { ResponseObject } = data;
        // ResponseObject.forEach(element => {
        //   this.operationTypesArray.push(String(element.NickName));
        // });
        // this.operationTypesEnum = this.setEnum(data.ResponseObject);
        this.operationTypesEnum = data.ResponseObject;
      }
    });
  }

  exportToCsv() {

    this.exportService.exportToCsv( Controllers.REPORT, Methods.EXPORT_REPORT_BY_AGENT_TRANSFERS, { ...this.filteredData, adminMenuId: this.adminMenuId });
  }

}
