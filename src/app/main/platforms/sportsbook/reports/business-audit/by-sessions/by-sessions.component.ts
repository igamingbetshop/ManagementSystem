import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BasePaginatedGridComponent} from 'src/app/main/components/classes/base-paginated-grid-component';
import {SportsbookApiService} from '../../../services/sportsbook-api.service';
import 'ag-grid-enterprise';
import {AgGridAngular} from 'ag-grid-angular';
import {Paging} from 'src/app/core/models';
import {take} from 'rxjs/operators';
import {DatePipe} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";
import {GridMenuIds} from "../../../../../../core/enums";
import {DateAdapter} from "@angular/material/core";
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';


@Component({
  selector: 'app-by-sessions',
  templateUrl: './by-sessions.component.html',
  styleUrls: ['./by-sessions.component.scss']
})
export class BySessionsComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid', {static: false}) agGrid: AgGridAngular;
  public commentTypes: any[] = [];
  public rowData = [];
  public selectedItem = 'today';
  public fromDate = new Date();
  public toDate = new Date();

  public sessionStates = [
    {Name: 'Active', Id: 1},
    {Name: 'Inactive', Id: 2},
    {Name: 'Pending', Id: 3},
    {Name: 'Wrong Password', Id: 32},
    {Name: 'AML Prohibited', Id: 155},
    {Name: 'JCJ Excluded', Id: 164}
  ];

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dateAdapter: DateAdapter<Date>
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_REPORT_BY_SESSIONS;
    this.dateAdapter.setLocale('en-GB');
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        sortable: true,
        minWidth: 80,
        cellStyle: {color: '#076192', 'font-size': '14px', 'font-weight': '500', 'padding-left': '10px',},
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
        headerName: 'SkillGames.PlayerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PlayerId',
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
        headerName: 'Clients.FirstName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FirstName',
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
        headerName: 'Clients.LastName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastName',
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
        headerName: 'Clients.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
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
        headerName: 'Clients.Language',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LanguageId',
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
        headerName: 'Common.Ip',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Ip',
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
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StateName',
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
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationDate',
        sortable: true,
        filter: 'agDateColumnFilter',
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationDate, 'medium');
          return `${dat}`;
        },
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.ExpirationDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ExpirationDate',
        sortable: true,
        filter: 'agDateColumnFilter',
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.ExpirationDate, 'medium');
          return `${dat}`;
        },
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },

    ];
  }

  ngOnInit() {
    this.gridStateName = 'by-sessions-grid-state';
    this.setTime();
  }

  go() {
    this.getCurrentPage();
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

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.pageindex = params.request.startRow / Number(this.cacheBlockSize);
        // paging.pagesize = this.cacheBlockSize;
        paging.pagesize = Number(this.cacheBlockSize);

        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;

        this.setSort(params.request.sortModel, paging, "OrderByDescending");
        this.setFilter(params.request.filterModel, paging);

        delete paging.StartDate;
        delete paging.EndDate;

        this.apiService.apiPost('report/clientsessions', paging,
        ).pipe(take(1)).subscribe(data => {
          if (data.Code === 0) {
            const mappedRows = data.ResponseObject.ResponseObject;
            mappedRows.forEach(obj => {
              let stName = this.sessionStates.find((st) => {
                return st.Id == obj.Status;
              })
              if (stName) {
                obj['StateName'] = stName.Name;
              }

            })
            params.success({rowData: mappedRows, rowCount: data.ResponseObject.TotalCount});
          } else {
            SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
          }
        });
      },
    };
  }
}
