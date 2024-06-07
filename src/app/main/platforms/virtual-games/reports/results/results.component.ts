import { Component, Injector, OnInit } from '@angular/core';
import { GridMenuIds, GridRowModelTypes } from "../../../../../core/enums";
import { MatSnackBar } from "@angular/material/snack-bar";
import { VirtualGamesApiService } from "../../services/virtual-games-api.service";
import { BasePaginatedGridComponent } from "../../../../components/classes/base-paginated-grid-component";
import { Paging } from "../../../../../core/models";
import { take } from "rxjs/operators";
import 'ag-grid-enterprise';
import { DatePipe } from "@angular/common";
import { OpenerComponent } from "../../../../components/grid-common/opener/opener.component";
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { DateAdapter } from "@angular/material/core";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent extends BasePaginatedGridComponent implements OnInit {
  public rowData;
  public rowModelType: string = GridRowModelTypes.SERVER_SIDE;
  public fromDate = new Date();
  public toDate = new Date();
  public filteredData;
  public selectedItem;
  public clientData;
  public path = 'game/unitresults';
  public statusTypes = [
    { Id: 1, Name: 'First Betting Period' },
    { Id: 2, Name: 'Second Betting Period' },
    { Id: 3, Name: 'Third Betting Period' },
    { Id: 10, Name: 'Calculation Period' },
    { Id: 11, Name: 'Finalizing Period' },
    { Id: 12, Name: 'Closed Round' },
    { Id: 20, Name: 'New Round Creation Period' }
  ];

  constructor(
    protected injector: Injector, private _snackBar: MatSnackBar,
    private apiService: VirtualGamesApiService,
    public dateAdapter: DateAdapter<Date>) {
    super(injector);
    this.adminMenuId = GridMenuIds.VG_REPORTS_BY_RESULTS;
    this.dateAdapter.setLocale('en-GB');
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
        maxWidth: 130,
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'SkillGames.UnitId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UnitId',
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
        headerName: 'Common.UnitName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UnitName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'VirtualGames.RoundId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RoundId',
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
        headerName: 'SkillGames.Game',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StateName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Common.CreationDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationDate',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationDate, 'medium');
          if (!params.data.CreationDate) {
            return ''
          } else {
            return `${dat}`;
          }
        },
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          data.path = this.router.url.split('?')[0] + '/' + params.data.Id;
          data.queryParams = { GameId: params.data.GameId, RoundId: params.data.RoundId };
          return data;
        },
        sortable: false
      }
    ]
  }

  ngOnInit(): void {
    this.setTime();
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
        paging.PageSize = this.cacheBlockSize;
        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;

        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost(this.path, paging)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities.map((items) => {
                items.StateName = this.statusTypes.find((item => item.Id === items.Status))?.Name
                return items;
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
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }


}
