import { Component, OnInit, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from '../../../services/sportsbook-api.service';
import 'ag-grid-enterprise';
import { Paging } from 'src/app/core/models';
import { take } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { DateAdapter } from "@angular/material/core";
import { GridMenuIds } from 'src/app/core/enums';
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { MATCH_STATUSES } from 'src/app/core/constantes/statuses';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';
import { CellClickedEvent } from 'ag-grid-community';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';


@Component({
  selector: 'app-all-finished',
  templateUrl: './all-finished.component.html',
  styleUrls: ['./all-finished.component.scss']
})
export class AllFinishedComponent extends BasePaginatedGridComponent implements OnInit {
  public rowData = [];
  public sports: any[] = [];
  public allProviders: any[] = [];
  public sportProviders: any[] = [];
  public availableProviders: any[] = [];
  public sportId: number;
  public providerId: number;
  public path = 'matches';
  public matches: any[] = [];
  public selectedItem = 'today';
  public fromDate = new Date();
  public toDate = new Date();
  public Statuses = MATCH_STATUSES;
  public frameworkComponents = {
    agDropdownFilter: AgDropdownFilter,
  }
  regions: any;

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    public dateAdapter: DateAdapter<Date>
  ) {
    super(injector);
    this.dateAdapter.setLocale('en-GB');
    this.adminMenuId = GridMenuIds.SP_MATCHES_FINISHED;
  }

  ngOnInit() {
    this.getSports();
    this.gridStateName = 'all-finished-matches-grid-state';
    this.setTime();
    this.getProviders();
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

  setColunmDef() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchId',
        sortable: false,
        resizable: true,
        tooltipField: 'Id',
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.Number',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Number',
        resizable: true,
        sortable: false,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Products.ExternalId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ExternalId',
        sortable: false,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: false,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.StartTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StartTime',
        sortable: false,
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
      {
        headerName: 'Sport.CompetitionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionName',
        sortable: false,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
        sortable: false,
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.sports,
        },
      },
      {
        headerName: 'Sport.RegionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RegionName',
        sortable: false,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Sport.AbsoluteLimit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AbsoluteLimit',
        resizable: true,
        sortable: false,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.Delay',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Delay',
        resizable: true,
        sortable: false,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Status',
        resizable: true,
        sortable: false,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.StatusName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StatusName',
        resizable: true,
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Sport.ResultInfo',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ResultInfo',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        filter: false,
        cellRenderer: params => {
          if (params.node.rowPinned) {
            return '';
          }
          return `<i style="color:#076192; padding-left: 20px; cursor: pointer;" class="material-icons">
            visibility
          </i>`;
        },
        onCellClicked: (event: CellClickedEvent) => this.redirectToFinished(event),
      },
    ];
  }

  redirectToFinished(ev) {
    const row = ev.data;

    const queryParams = {
      finishId: row.MatchId,
      partnerId: row.PartnerId || '',
      number: row.Number || '',
      name: row.Name || '',
      isMainPartner: row.isMainPartner || '',
    };

    const queryString = Object.keys(queryParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
      .join('&');

    const newWindow = window.open(`/main/sportsbook/matches/finished/finish/main?${queryString}`, '_blank');

    if (newWindow) {
      newWindow.focus();
    }
  }


  getSports() {
    this.apiService.apiPost('sports').subscribe(data => {
      if (data.Code === 0) {
        this.sports = data.ResponseObject;
        this.setColunmDef();
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  getProviders() {
    this.apiService.apiPost('providers').subscribe(data => {
      if (data.Code === 0) {
        this.allProviders = data.Objects;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  go() {
    this.getCurrentPage();
  }

  onSportChange(value) {
    this.sportId = value;
    this.go();
  }

  onProviderChange(val) {
    this.providerId = val;
    this.go();
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
        paging.pageindex = this.paginationPage - 1;
        paging.PageSize = Number(this.cacheBlockSize);
        paging.partnerId = 100;
        paging.competitionId = null;
        paging.ActiveStatus = 2;
        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;

        if (this.sportId) {
          paging.SportIds = {
            IsAnd: true,
            ApiOperationTypeList: [{ IntValue: this.sportId, OperationTypeId: 1 }]
          };
        } else if (paging.hasOwnProperty("SportIds")) {
          delete paging.SportIds;
        }
        this.changeFilerName(params.request.filterModel,
          ['SportName', 'Status'], ['SportId', 'Statuse']);

        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost(this.path, paging,).pipe(take(1)).subscribe(data => {
          if (data.Code === 0) {
            let mappedRows = data.Objects;
            mappedRows.forEach(d => {
              d.TempName = [];
              if (d.Competitors.length) {
                d.Competitors.forEach(s => {
                  d.TempName.push(s.TeamName);
                })
              }
              d.Name = d.TempName.join(' VS ');
            });

            this.availableProviders = [];

            mappedRows.forEach(item => {
              let provider = this.allProviders.find(elem => elem.Id == item.ProviderId);
              item.StatusName = this.Statuses.find(x => x.status === item.Status).Name;
              if (provider) {
                let index = this.availableProviders.findIndex(elem => elem.Id == provider.Id);

                if (index == -1)
                  this.availableProviders.push(provider);
              }

            });

            this.sportProviders = this.availableProviders;

            if (this.providerId) {
              mappedRows = mappedRows.filter(el => {
                return el.ProviderId == this.providerId;
              })
            }

            params.success({ rowData: mappedRows, rowCount: data.TotalCount });
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        });
      },
    };
  }

}
