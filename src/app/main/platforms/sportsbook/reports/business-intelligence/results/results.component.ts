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
import {DateAdapter} from "@angular/material/core";
import { GridMenuIds } from 'src/app/core/enums';
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid', {static: false}) agGrid: AgGridAngular;
  public commentTypes: any[] = [];
  public rowData = [];
  public selectedItem = 'today';
  public fromDate = new Date();
  public toDate = new Date();

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dateAdapter: DateAdapter<Date>
    //public router: ActivatedRoute,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_REPORT_BY_RESULTS;
    this.dateAdapter.setLocale('en-GB');
    this.columnDefs = [
      {
        headerName: 'Sport.SportId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportId',
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
        headerName: 'Sport.MatchId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchId',
        resizable: true,
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Sport.CompetitionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionId',
        resizable: true,
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Sport.Number',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Number',
        resizable: true,
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Common.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
        resizable: true,
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Sport.CompetitionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionName',
        resizable: true,
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Sport.RegionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RegionName',
        resizable: true,
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TeamName',
        resizable: true,
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Common.Info',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ReslutInfo',
        resizable: true,
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Sport.MatchState',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchStatus',
        resizable: true,
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Clients.StartTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StartTime',
        sortable: true,
        filter: 'agDateColumnFilter',
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.StartTime, 'medium');
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
    this.gridStateName = 'results-grid-state';
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


  createServerSideDatasource() {
    return {
      getRows: (params) => {

        const paging = new Paging();
        paging.PageIndex = this.paginationPage - 1;
        // paging.pagesize = this.cacheBlockSize;
        paging.PageSize = Number(this.cacheBlockSize);

        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;

        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        delete paging.StartDate;
        delete paging.EndDate;

        this.apiService.apiPost('report/results', paging,
        ).pipe(take(1)).subscribe(data => {
          if (data.Code === 0) {
            const mappedRows = data.ResponseObject.Results;
            mappedRows.forEach(data => {
              data["TeamName"] = `${data.Competitors[0].TeamName} VS ${data.Competitors[1].TeamName}`
            })
            params.success({rowData: mappedRows, rowCount: data.ResponseObject.TotalCount});
          } else {
            SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
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
