import { AfterViewInit, Component, inject, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { AgGridAngular } from "ag-grid-angular";
import { take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DateAdapter } from "@angular/material/core";

import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { Controllers, GridMenuIds, Methods } from "../../../../../../../core/enums";
import { CoreApiService } from "../../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../../core/services";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { Paging } from 'src/app/core/models';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';
import { syncNestedColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import { ExportService } from "../../../../services/export.service";
import { DatePipe } from '@angular/common';
import { AgDateTimeFilter } from 'src/app/main/components/grid-common/ag-date-time-filter/ag-date-time-filter.component';


@Component({
  selector: 'app-duplicates',
  templateUrl: './duplicates.component.html',
  styleUrls: ['./duplicates.component.scss']
})
export class DuplicatesComponent extends BasePaginatedGridComponent implements OnInit, AfterViewInit {

  @ViewChild('agGrid') agGrid: AgGridAngular;
  clientId?: number;
  rowData = [];
  statusNames = [];
  operationTypesArray = [];
  partnerId?: number;
  fromDate = new Date();
  toDate = new Date();
  pageFilter = {};
  selectedItem = 'today';
  partners = [];
  operationTypesEnum;
  savedFilterModel;
  frameworkComponents 
  pageIdName = ''
  private exportService = inject(ExportService);
  constructor(
    protected apiService: CoreApiService,
    protected activateRoute: ActivatedRoute,
    protected injector: Injector,
    protected commonDataService: CommonDataService,
    protected configService: ConfigService,
    protected _snackBar: MatSnackBar,
    protected dateAdapter: DateAdapter<Date>
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.CLIENTS_DUPLICATES;
    this.dateAdapter.setLocale('en-GB');
    this.frameworkComponents= {
      agDropdownFilter: AgDropdownFilter,
      agDateTimeFilter: AgDateTimeFilter
    };
  }

  ngAfterViewInit(): void {
    this.getFilterModelFromLocalStorage();
  }

  ngOnInit(): void {
    this.setTime();
    this.getOperationTypesEnum();
    this.partners = this.commonDataService.partners || null;
    this.clientId = +this.activateRoute.snapshot.queryParams.clientId || null;
    this.pageIdName = `/ ${this.clientId} : ${this.translate.instant('Clients.Duplicates')}`;
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
    this.getCurrentPage();
  }

  setColumnDefs() {
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
        headerName: 'Clients.DuplicatedClientId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DuplicatedClientId',
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
        headerName: 'Clients.DuplicatedData',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DuplicatedData',
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
        headerName: 'Clients.MatchDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchDate',
        sortable: true,
        resizable: true,
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          let datePipe = new DatePipe('en-US');
          let dat = datePipe.transform(params.data.MatchDate, 'medium');
          return `${dat}` || '';
        },
      },
      {
        headerName: 'Common.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
        sortable: true,
        resizable: true,
        filter: false,
      },
    ];
  }

  getOperationTypesEnum() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_OPERATION_TYPES_ENUM).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          let { ResponseObject } = data;
          ResponseObject.forEach(element => {
            this.operationTypesArray.push(String(element.NickName));
          });
          this.operationTypesEnum = this.setEnum(data.ResponseObject);
        }
        this.getDocumenStatesEnum();

      });
  }

  getDocumenStatesEnum() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_DOCUMENT_STATES_ENUM).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.statusNames = data.ResponseObject;
          this.setColumnDefs();
        }
      });
  }



  onGridReady(params) {
    syncNestedColumnReset();
    super.onGridReady(params);
    this.gridApi = params.api;
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        if (this.partnerId) {
          paging.PartnerId = this.partnerId;
        }
        if (this.clientId) {
          paging.ClientId = this.clientId;
        }
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;

        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.pageFilter = { ...paging };
        // if(this.pageFilter['OperationTypeIds']?.ApiOperationTypeList[0].ArrayValue.length === 0) {
        //   delete this.pageFilter['OperationTypeIds'];
        // }
        // if(this.pageFilter['OperationTypeIds']) {
        //   this.pageFilter['OperationTypeIds'].ApiOperationTypeList[0].ArrayValue = this.transformArrayToNumbers(this.pageFilter['OperationTypeIds'].ApiOperationTypeList[0].ArrayValue, this.operationTypesEnum);
        // }

        this.apiService.apiPost(this.configService.getApiUrl, this.pageFilter, true,
          Controllers.REPORT, Methods.GET_DUPLICATE_CLIENTS).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities;
              mappedRows.forEach((item) => {
                item.PartnerId = this.partners.find((partner) => partner.Id === item.PartnerId)?.Name;

              });
              params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      },
    };
  }

  saveFilterModelToLocalStorage() {
    const filterModel = this.gridApi?.getFilterModel();
    this.localstorageService.add('agGridFilterModel', filterModel)
  }

  getFilterModelFromLocalStorage() {
    const filterModel = this.localstorageService.get('agGridFilterModel');
    setTimeout(() => {
      this.gridApi?.setFilterModel(filterModel);
    }, 1000);
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  exportToCsv() {

    this.exportService.exportToCsv(Controllers.REPORT, Methods.EXPORT_CLIENT_DOCUMENTS, this.pageFilter);
  }

  transformArrayToNumbers(array, obj) {
    if (array.every(function (element) {
      return typeof element === 'number';
    })) {
      return array
    }
    const result = [];
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      const key = Object.keys(obj).find((key) => obj[key] === item);
      if (key) {
        result.push(Number(key));
      }
    }
    return result;
  }

  onNavigateToClient() {
    this.router.navigate(["/main/platform/clients/all-clients"])
  }

}
