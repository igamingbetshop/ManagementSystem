import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';

import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter } from "@angular/material/core";
import { MatDialog } from '@angular/material/dialog';
import 'ag-grid-enterprise';
import { AgGridAngular } from 'ag-grid-angular';

import { SportsbookApiService } from '../../../services/sportsbook-api.service';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { Paging } from 'src/app/core/models';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { GridMenuIds } from 'src/app/core/enums';
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';


@Component({
  selector: 'app-change-history',
  templateUrl: './by-change-history.component.html',
  styleUrls: ['./by-change-history.component.scss']
})
export class ByChangeHistoryComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  public commentTypes: any[] = [];
  public rowData = [];
  public selectedItem = 'today';

  public fromDate = new Date();
  public toDate = new Date();
  public clientData = {};

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dateAdapter: DateAdapter<Date>
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_REPORT_BY_SELECTION_CHANGES;
    this.dateAdapter.setLocale('en-GB');
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        sortable: true,
        minWidth: 80,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500', 'padding-left': '10px', },
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Partners.PartnerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.UserId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserId',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.NameSurname',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Sport.MatchId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchId',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.MarketId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketId',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Segments.SelectionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionId',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.OldBlocked',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OldBlocked',
        resizable: true,
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Sport.NewBlocked',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NewBlocked',
        resizable: true,
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Sport.OldCoefficient',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OldInitialCoefficient',
        resizable: true,
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Sport.NewCoefficient',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NewInitialCoefficient',
        resizable: true,
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Sport.OldStatus',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OldStatus',
        resizable: true,
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Sport.NewStatus',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NewStatus',
        resizable: true,
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Payments.Date',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ChangeDateTime',
        sortable: true,
        filter: 'agDateColumnFilter',
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.ChangeDateTime, 'medium');
          return `${dat}`;
        },
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Payments.Comment',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Comment',
        resizable: true,
        sortable: false,
        filter: false,
      },
    ];
  }

  ngOnInit() {
    this.setTime();
    this.gridStateName = 'results-grid-state';
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.getCurrentPage();
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.PageIndex = this.paginationPage - 1;
        // paging.pagesize = this.cacheBlockSize;
        paging.PageSize = Number(this.cacheBlockSize);
        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;
        this.setSort(params.request.sortModel, paging, "OrderByDescending");
        this.setFilter(params.request.filterModel, paging);
        delete paging.StartDate;
        delete paging.EndDate;

        this.apiService.apiPost('report/selectionchangehistories', paging,
        ).pipe(take(1)).subscribe(data => {
          if (data.Code === 0) {
            const mappedRows = data.ResponseObject;
            mappedRows.forEach(elem => {

              elem["UserName"] = elem.UserFirstName + " " + elem.UserLastName;
            })
            params.success({ rowData: mappedRows, rowCount: data.TotalCount });
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        });
      },
    };
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }
}
