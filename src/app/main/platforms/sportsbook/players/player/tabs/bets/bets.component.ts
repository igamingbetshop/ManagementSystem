import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SportsbookApiService} from "../../../../services/sportsbook-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AgGridAngular} from "ag-grid-angular";
import {BasePaginatedGridComponent} from "../../../../../../components/classes/base-paginated-grid-component";
import {Paging} from "../../../../../../../core/models";
import {take} from "rxjs/operators";
import 'ag-grid-enterprise';
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {AgBooleanFilterComponent} from "../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import {ButtonRendererComponent} from "../../../../../../components/grid-common/button-renderer.component";
import {NumericEditorComponent} from "../../../../../../components/grid-common/numeric-editor.component";
import {CheckboxRendererComponent} from "../../../../../../components/grid-common/checkbox-renderer.component";
import {CellClickedEvent} from "ag-grid-community";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import {DateAdapter} from "@angular/material/core";
import {OddsTypePipe} from "../../../../../../../core/pipes/odds-type.pipe";
import {LocalStorageService} from "../../../../../../../core/services";
import { OddsTypes, ModalSizes } from 'src/app/core/enums';
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';

@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.scss']
})
export class BetsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public playerId: number;
  public availableBetCategoriesStatus: number = -1;
  public availableStatusesStatus: number = -1;
  public availableBetCategories = [
    {Id: 1, status: -1, Name: 'All Bets'},
    {id: 2, status: 0, Name: 'Real Bets'},
    {id: 3, status: 1, Name: 'Bonus Bets'}
  ];
  public availableStatuses = [
    {Id: 1, status: -1, Name: 'All'},
    {Id: 2, status: 0, Name: 'Prematch'},
    {Id: 3, status: 1, Name: 'Live'}
  ];
  public betStatuses = [
    {"Name": "Uncalculated", Id: 1},
    {"Name": "Won", Id: 2},
    {"Name": "Lost", Id: 3},
    {"Name": "Deleted", Id: 4},
    {"Name": "CashoutedFully", Id: 5},
    {"Name": "Returned", Id: 6},
    {"Name": "NotAccepted", Id: 7},
    {"Name": "CashoutedPartially", Id: 8},
    {"Name": "Waiting", Id: 9}
  ];
  public commentTypes = [];
  public totalBetAmount;
  public totalWinAmount;
  public totalProfit;
  public playerCurrency;
  public detailsInline;
  public masterDetail;
  public selectedItem = 'today';
  public detailCellRendererParams: any;
  public fromDate = new Date();
  public toDate = new Date();
  public nestedFrameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
  };
  private oddsType: number;

  constructor(private activateRoute: ActivatedRoute,
              private apiService: SportsbookApiService,
              private _snackBar: MatSnackBar,
              public dialog: MatDialog,
              public router: Router,
              protected injector: Injector,
              public dateAdapter: DateAdapter<Date>,
              private localStorageService: LocalStorageService
              ) {
    super(injector);
    this.dateAdapter.setLocale('en-GB');
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        cellRenderer: 'agGroupCellRenderer',
        minWidth: 120,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.TypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeId',
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
        headerName: 'Partners.PlatformId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ExternalBetId',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Sport.Coefficient',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Coefficient',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: (params) => {
          const oddsTypePipe = new OddsTypePipe();
          let data = oddsTypePipe.transform(params.data.Coefficient, this.oddsType);
          return `${data}`;
        }
      },
      {
        headerName: 'SkillGames.BetAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetAmount',
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
        headerName: 'Common.WinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'WinAmount',
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
        headerName: 'Sport.Profit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProfitAmount',
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
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StatusName',
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
        headerName: 'Common.BetDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetDate',
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
          let dat = datePipe.transform(params.data.BetDate, 'medium');
          if (params.node.rowPinned) {
            return ''
          } else {
            return `${dat}`;
          }
        },
      },
      {
        headerName: 'Common.CommentTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CommentTypeId',
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
        headerName: 'Sport.MatchId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchId',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          let names = `<span data-action-type="view-name">${params.data.MatchId}</span>`;
          return `${names}`;
        },
        cellStyle: {cursor: 'pointer', 'text-decoration': 'underline'},
        onCellClicked: (event: CellClickedEvent) => this.goToFinished(event),
      },
      {
        headerName: 'Sport.Competitors',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Competitors',
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
        headerName: 'Sport.SportId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportId',
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
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
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
        headerName: 'Sport.CompetitionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionId',
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
        headerName: 'Sport.CompetitionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionName',
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
        headerName: 'Sport.MarketTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketTypeId',
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
        headerName: 'Sport.MarketName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketName',
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
        headerName: 'Common.SelectionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionName',
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
        headerName: 'Clients.Notes',
        headerValueGetter: this.localizeHeader.bind(this),
        resizable: true,
        sortable: false,
        minWidth: 130,
        filter: false,
        cellRenderer: params => {
          let keyData = params.data.HasNote;
          let newButton = `<button class="button-view-1" data-action-type="add">Add Note</button>`;
          let newButton2 = `<button class="button-view-2" data-action-type="add">Add</button>
             <button class="button-view-2" data-action-type="view">View</button>`
          if (keyData === false) {
            return newButton;
          } else if (keyData === true) {
            return newButton2;
          }
        }
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
        components: this.nestedFrameworkComponents,
        columnDefs: [
          {
            headerName: 'Sport.MatchId',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'MatchId',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.MatchNumber',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'MatchNumber',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Segments.SelectionId',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'SelectionId',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Common.SelectionName',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'SelectionName',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.MarketId',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'MarketId',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.MarketName',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'MarketName',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.CompetitionName',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'CompetitionName',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.RegionName',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'RegionName',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.SportName',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'SportName',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.Competitors',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'Competitors',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.IsLive',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'IsLive',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.Coefficient',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'Coefficient',
            sortable: true,
            resizable: true,
            cellRenderer: (params) => {
              const oddsTypePipe = new OddsTypePipe();
              let data = oddsTypePipe.transform(params.data.Coefficient, this.oddsType);
              return `${data}`;
            }
          },
          {
            headerName: 'Common.Status',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'Status',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Common.EventDate',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'EventDate',
            sortable: true,
            resizable: true,
            cellRenderer: function (params) {
              let datePipe = new DatePipe("en-US");
              let dat = datePipe.transform(params.data.EventDate, 'medium');
              if (params.node.rowPinned) {
                return ''
              } else {
                return `${dat}`;
              }
            },
          },
          {
            headerName: 'Sport.MatchState',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'MatchState',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Common.View',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'View',
            resizable: true,
            minWidth: 150,
            sortable: false,
            filter: false,
            cellRenderer: 'buttonRenderer',
            cellRendererParams: {
              onClick: this.viewFinishes['bind'](this),
              Label: 'View',
              bgColor: '#076192',
              textColor: 'white'
            }
          }
        ],
        onGridReady: params => {
        },
      },
      getDetailRowData: params => {
        if (params) {
          this.apiService.apiPost('report/selections', {BetId: params.data.Id}).subscribe(data => {
            if (data.Code === 0) {
              const nestedRowData = data.Selections
              this.detailsInline = data.Selections
              params.successCallback(nestedRowData);
            }
          })
        }
      },
    }

  }

  ngOnInit() {
    this.playerId = this.activateRoute.snapshot.queryParams.playerId;
    this.oddsType = this.localStorageService.get('user')?.OddsType !== null ? this.localStorageService.get('user').OddsType : OddsTypes.Decimal;
    this.getCommentTypes();
    this.startDate();
    this.playerCurrency = JSON.parse(localStorage.getItem('user'))?.CurrencyId;
  }

  go() {
    this.getCurrentPage();
  }

  viewFinishes(params) {
    const row = params.data;
    const url = this.router.navigate(['main/sportsbook/matches/finished/finish/markets'],
      {queryParams: {"finishId": row.MatchId, "number": row.MatchNumber, "name": row.Competitors}});
  }

  getCommentTypes() {
    this.apiService.apiPost('commenttypes').subscribe(data => {
      if (data.Code === 0) {
        this.commentTypes = data.CommentTypes;
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }

    })
  }

  today(time) {
    let fromDay = new Date();
    fromDay.setHours(0);
    fromDay.setMinutes(0);
    fromDay.setSeconds(0);
    fromDay.setMilliseconds(0);

    let toDay = new Date();
    toDay.setHours(0);
    toDay.setMinutes(0);
    toDay.setSeconds(0);
    toDay.setMilliseconds(0);
    toDay.setDate(toDay.getDate() + 1);

    let dd = new Date();
    dd.setHours(0);
    dd.setMinutes(0);
    dd.setSeconds(0);
    dd.setMilliseconds(0);
    switch (time) {
      case 'month':
        dd.setMonth(dd.getMonth() - 1);
        this.dateRangeFG.get('start').setValue(dd);
        this.dateRangeFG.get('end').setValue(toDay);

        break;
      case 'week':
        dd.setDate(dd.getDate() - 7);
        this.dateRangeFG.get('start').setValue(dd);
        this.dateRangeFG.get('end').setValue(toDay);
        break;
      case 'yesterday':
        dd.setDate(dd.getDate() - 1);
        this.dateRangeFG.get('start').setValue(dd);
        this.dateRangeFG.get('end').setValue(toDay);
        break;
      case 'today':
        dd.setHours(0);
        dd.setMinutes(0);
        dd.setSeconds(0);
        dd.setMilliseconds(0);
        this.dateRangeFG.get('start').setValue(dd);
        this.dateRangeFG.get('end').setValue(toDay);
        break;
    }
    this.selectedItem = time;
    this.go();
  }

  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
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
    this.getCurrentPage();
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {

        const paging = new Paging();
        paging.PageIndex = this.paginationPage - 1;
        // paging.pagesize = this.cacheBlockSize;
        paging.PageSize = Number(this.cacheBlockSize);
        paging.LiveStatus = this.availableStatusesStatus;
        paging.BetCategory = this.availableBetCategoriesStatus;

        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;
        paging.PlayerIds = {
          IsAnd: true,
          ApiOperationTypeList: [{OperationTypeId: 1, IntValue: this.playerId, DecimalValue: this.playerId}]
        }

        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        delete paging.StartDate;
        delete paging.EndDate;

        this.apiService.apiPost('report/bets', paging,
        ).pipe(take(1)).subscribe(data => {
          if (data.Code === 0) {
            const mappedRows = data.Objects;
            mappedRows.forEach((bet) => {
              let statusName = this.betStatuses.find((status) => {
                return status.Id == bet.Status;
              })
              if (statusName) {
                bet['StatusName'] = statusName.Name;
              }
            })
            this.totalBetAmount = data.TotalBetAmount;
            this.totalWinAmount = data.TotalWinAmount;
            this.totalProfit = data.TotalProfit;
            params.success({rowData: mappedRows, rowCount: data.TotalCount});
            this.gridApi?.setPinnedBottomRowData([
              {
                BetAmount: `${this.totalBetAmount.toFixed(2)} ${this.playerCurrency}`,
                WinAmount: `${this.totalWinAmount.toFixed(2)} ${this.playerCurrency}`,
                ProfitAmount: `${this.totalProfit.toFixed(2)} ${this.playerCurrency}`
              }
            ]);
          } else {
            SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
          }
        });
      },
    };
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  onStartDateChange(event) {
    this.fromDate = event.value;
  }

  onEndDateChange(event) {
    this.toDate = event.value;
  }

  async addNotes(params) {
    const {SbAddNoteComponent} = await import('../../../../../../components/sb-add-note/sb-add-note.component');
    const dialogRef = this.dialog.open(SbAddNoteComponent, {
      width: ModalSizes.MEDIUM,
      data: {CommentTypes: this.commentTypes, BetId: params.Id}
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getCurrentPage();
      }
    });
  }

  async openNotes(params) {
    const {SbViewNoteComponent} = await import('../../../../../../components/sb-view-note/sb-view-note.component');
    const dialogRef = this.dialog.open(SbViewNoteComponent, {
      width: ModalSizes.EXTRA_LARGE,
      data: {CommentTypes: this.commentTypes, BetId: params.Id}
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
      }
    });
  }

  onRowClicked(e) {
    if (e.event.target !== undefined) {
      let data = e.data;
      let actionType = e.event.target.getAttribute("data-action-type");

      switch (actionType) {
        case "add":
          return this.addNotes(data);
        case "view":
          return this.openNotes(data);
      }
    }
  }

  goToFinished(event) {
    const row = event.data;
    const url = this.router.navigate(['main/sportsbook/matches/finished/finish/main'],
      {queryParams: {"finishId": row.MatchId, "number": row.MatchNumber, "name": row.Competitors}});
  }

}
function syncPaginationWithBtn() {
  throw new Error('Function not implemented.');
}

function syncColumnSelectPanel() {
  throw new Error('Function not implemented.');
}

