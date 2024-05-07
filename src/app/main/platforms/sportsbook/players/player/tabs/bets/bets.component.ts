import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { SportsbookApiService } from "../../../../services/sportsbook-api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AgGridAngular } from "ag-grid-angular";
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { Paging } from "../../../../../../../core/models";
import { take } from "rxjs/operators";
import 'ag-grid-enterprise';
import { DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { AgBooleanFilterComponent } from "../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../../../../components/grid-common/numeric-editor.component";
import { CheckboxRendererComponent } from "../../../../../../components/grid-common/checkbox-renderer.component";
import { CellClickedEvent } from "ag-grid-community";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { DateAdapter } from "@angular/material/core";
import { OddsTypePipe } from "../../../../../../../core/pipes/odds-type.pipe";
import { LocalStorageService } from "../../../../../../../core/services";
import { OddsTypes, ModalSizes } from 'src/app/core/enums';
import { BETAVAILABLESTATUSES, BETSTATUSES } from 'src/app/core/constantes/statuses';
import { syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';

@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.scss']
})
export class BetsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  rowData = [];
  playerId: number;
  availableBetCategoriesStatus: number = -1;
  availableStatusesStatus: number = -1;
  availableBetCategories = [
    { Id: 1, status: -1, Name: 'All Bets' },
    { id: 2, status: 0, Name: 'Real Bets' },
    { id: 3, status: 1, Name: 'Bonus Bets' }
  ];

  betTypesModel = [
    { Name: "Single", Id: 1 },
    { Name: "Multiple", Id: 2 },
    { Name: "System", Id: 3 },
    { Name: "Chain", Id: 4 },
    { Name: "Teaser", Id: 5 },
  ];
  availableStatuses = BETAVAILABLESTATUSES;
  betStatuses = BETSTATUSES;
  commentTypes = [];
  totalBetAmount;
  totalWinAmount;
  totalProfit;
  playerCurrency;
  detailsInline;
  masterDetail;
  selectedItem = 'today';
  detailCellRendererParams: any;
  fromDate = new Date();
  toDate = new Date();
  nestedFrameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
  };
  frameworkComponents = {
    agDropdownFilter: AgDropdownFilter,
  }
  private oddsType: number;
  filteredData: Paging;
  pageIdName: string;

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
          return data ? ` ${data}` : '';
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
        headerName: 'Sport.BonusWinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusWinAmount',
        filter: 'agNumberColumnFilter',
        tooltipField: 'BonusWinAmount',
        tooltipComponentParams: { color: '#ececec' },
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.TypeName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeId',
        sortable: false,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.betTypesModel,
        },
      },
      {
        headerName: 'Sport.IsFreeBet',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsFreeBet',
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Sport.MatchState',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsLive',
        filter: false,
        cellRenderer: params => {
          let isLiv = params.data.IsLive;
          let show = isLiv ? 'Live' : 'Prematch';
          return `${show}`;
        },
        cellStyle: (params) => {
          if (params.node.rowPinned) {
            return { display: 'none' };
          }

          if (params.data.IsLive == true) {
            return { color: 'black', backgroundColor: '#BCE1BA', borderRadius: '4px' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Common.BetDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetDate',
        filter: 'agDateColumnFilter',
        cellRenderer: (params) => {
          if (params.node.rowPinned || params.data.BetDate === null) {
            return '';
          }

          let datePipe = new DatePipe("en-US");
          let time = datePipe.transform(params.data.BetDate, 'HH:mm:ss');
          let date = datePipe.transform(params.data.BetDate, 'mediumDate');

          return time && date ? `${time} ${date}` : '';
        },

        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Dashboard.CalculationDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CalculationDate',
        filter: 'agDateColumnFilter',
        cellRenderer: (params) => {
          if (params.node.rowPinned || params.data.CalculationDate === null) {
            return '';
          }
          let datePipe = new DatePipe("en-US");
          let time = datePipe.transform(params.data.CalculationDate, 'HH:mm:ss');
          let date = datePipe.transform(params.data.CalculationDate, 'mediumDate');
          return time && date ? `${time} ${date}` : '';
        },
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
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.betStatuses,
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
          return names ? `${names}` : '';
        },
        cellStyle: { cursor: 'pointer', 'text-decoration': 'underline' },
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
        headerName: 'Common.Ip',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Ip',
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
        },
        cellStyle: function (params) {
          if (params.data.CommentTypeColor !== '#FFFFFF') {
            return { color: 'black', backgroundColor: params.data.CommentTypeColor };
          } else {
            return null;
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
            headerName: 'Sport.MatchState',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'IsLive',
            filter: false,
            cellRenderer: params => {
              let isLiv = params.data.IsLive;
              let show = isLiv ? 'Live' : 'Prematch';
              return `${show}`;
            },
            cellStyle: (params) => {
              if (params.node.rowPinned) {
                return { display: 'none' };
              }

              if (params.data.IsLive == true) {
                return { color: 'black', backgroundColor: '#BCE1BA', borderRadius: '4px' };
              } else {
                return null;
              }
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
              bgColor: '#3E4D66',
              textColor: 'white'
            }
          }
        ],
        onGridReady: params => {
        },
      },
      getDetailRowData: params => {
        if (params) {
          this.apiService.apiPost('report/selections', { BetId: params.data.Id }).subscribe(data => {
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
    this.setTime();
    this.pageIdName = `/ ${this.playerId} : ${this.translate.instant('Clients.Bets')}`;
    this.playerCurrency = JSON.parse(localStorage.getItem('user'))?.CurrencyId;
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

  onSelectBetCategory(event) {
    this.availableBetCategoriesStatus = event;
    this.getCurrentPage();
  }

  onSelectBetStatus(event) {
    this.availableStatusesStatus = event;
    this.getCurrentPage();
  }

  viewFinishes(params) {
    const row = params.data;
    const url = this.router.navigate(['main/sportsbook/matches/finished/finish/markets'],
      { queryParams: { "finishId": row.MatchId, "number": row.MatchNumber, "name": row.Competitors } });
  }

  getCommentTypes() {
    this.apiService.apiPost('commenttypes').subscribe(data => {
      if (data.Code === 0) {
        this.commentTypes = data.CommentTypes;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }

    })
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnSelectPanel();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.PageIndex = this.paginationPage - 1;
        paging.PageSize = Number(this.cacheBlockSize);
        paging.LiveStatus = this.availableStatusesStatus;
        paging.BetCategory = this.availableBetCategoriesStatus;
        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;
        paging.PlayerIds = {
          IsAnd: true,
          ApiOperationTypeList: [{ OperationTypeId: 1, IntValue: this.playerId, DecimalValue: this.playerId }]
        }
        this.changeFilerName(params.request.filterModel,
          ['StatusName'], ['State']);
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        delete paging.StartDate;
        delete paging.EndDate;
        this.filteredData = paging;
        this.apiService.apiPost('report/bets', paging,
        ).pipe(take(1)).subscribe(data => {
          if (data.Code === 0) {
            const mappedRows = data.Objects;
            mappedRows.forEach((bet) => {
              bet.StatusName = this.betStatuses.find((status) => status.Id == bet.State)?.Name;
            })
            this.totalBetAmount = data.TotalBetAmount;
            this.totalWinAmount = data.TotalWinAmount;
            this.totalProfit = data.TotalProfit;

            console.log('mappedRows', mappedRows);
            
            params.success({ rowData: mappedRows, rowCount: data.TotalCount });
            this.gridApi?.setPinnedBottomRowData([
              {
                BetAmount: `${this.totalBetAmount.toFixed(2)} ${this.playerCurrency}`,
                WinAmount: `${this.totalWinAmount.toFixed(2)} ${this.playerCurrency}`,
                ProfitAmount: `${this.totalProfit.toFixed(2)} ${this.playerCurrency}`
              }
            ]);
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

  async addNotes(params) {
    const { SbAddNoteComponent } = await import('../../../../../../components/sb-add-note/sb-add-note.component');
    const dialogRef = this.dialog.open(SbAddNoteComponent, {
      width: ModalSizes.MEDIUM,
      data: { CommentTypes: this.commentTypes, BetId: params.Id }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        if (this.gridApi) {
          const rowIdToUpdate = params.Id;
          const displayedRows = this.gridApi.getDisplayedRowCount();

          for (let rowIndex = 0; rowIndex < displayedRows; rowIndex++) {
            const rowNode = this.gridApi.getDisplayedRowAtIndex(rowIndex);

            if (rowNode && rowNode.data && rowNode.data.Id === rowIdToUpdate) {
              rowNode.data.HasNote = true;
              rowNode.data.CommentTypeId = data.TypeId;
              rowNode.data.CommentTypeColor = data.Color;
              this.gridApi.redrawRows({ rowNodes: [rowNode] });
              this.gridApi.redrawRows({ rowNodes: [rowNode] });
              break;
            }
          }
        }
      }
    });
  }

  async openNotes(params) {
    const { SbViewNoteComponent } = await import('../../../../../../components/sb-view-note/sb-view-note.component');
    const dialogRef = this.dialog.open(SbViewNoteComponent, {
      width: ModalSizes.EXTRA_LARGE,
      data: { CommentTypes: this.commentTypes, BetId: params.Id }
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
      { queryParams: { "finishId": row.MatchId, "number": row.MatchNumber, "name": row.Competitors } });
  }

  exportToCsv() {
    this.apiService.apiPost('report/exportbets',  {...this.filteredData, adminMenuId: this.adminMenuId}).pipe(take(1)).subscribe((data) => {
      if (data.Code === 0) {
        let iframe = document.createElement("iframe");
        iframe.setAttribute("src", this.configService.defaultOptions.SBApiUrl + '/' + data.ResponseObject.ExportedFilePath);
        iframe.setAttribute("style", "display: none");
        document.body.appendChild(iframe);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  onNavigateTo() {
    this.router.navigate(["/main/sportsbook/players/all-players"])
  }

}

